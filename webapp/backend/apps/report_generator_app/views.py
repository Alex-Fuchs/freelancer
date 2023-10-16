""""
Module for the request handling.
@author Lukas Ellinger
"""
import os
import threading
import time
from typing import List

from django.http import JsonResponse, HttpRequest

from config import PROJECT_DIR
from language import get_translation
from services.email.email_service import EmailService
from services.user_service import UserService
from view.invoice.invoice_view import InvoiceView
from view.report.report import Report
from webapp.backend.apps.report_generator_app.token_store import TOKEN_STORE
from webapp.backend.apps.report_generator_app.utils import generate_sha512_hash, validate_json_post_request, \
    get_orders_for_role, get_jobs_for_role, generate_token, validate_token


def get_data(request, data_function, rename_columns):
    """
    Validates the incoming JSON request, extracts a token, and processes the data
    using the specified data_function. It then renames the columns of the resulting data based
    on the provided rename_columns mapping.
    :param request: The incoming HTTP request object.
    :param data_function: A function that retrieves and processes data based on user role and role_id.
    :param rename_columns: A dictionary mapping original column names to new column names.
    :return: A JSON response containing the processed data and renamed columns, or an error response
             if the request or token is invalid.
    """
    data = validate_json_post_request(request)
    if not data:
        return JsonResponse({'loaded': False, 'message': f'Request does not match the expected form.'}, status=400)

    token = validate_token(data.get('token', ''))
    if not token:
        return JsonResponse({'loaded': False, 'message': 'Not a valid token.'}, status=401)

    role = token.get('role')
    role_id = token.get('role_id')
    data_result = data_function(role, role_id)
    data_result.rename(columns=rename_columns, inplace=True)
    return JsonResponse(
        {'loaded': True, 'columns': [get_translation(column) for column in data_result.columns], 'data': data_result.values.tolist()})


def order_data(request):
    """
    Is a wrapper around the get_data function, specifically tailored for retrieving
    and processing order data based on user role and role_id.
    :param request: The incoming HTTP request object.
    :return: A JSON response containing the processed order data and renamed columns, or an error
             response if the request or token is invalid.
    """
    return get_data(request, get_orders_for_role, {'id': 'order_id'})


def job_data(request):
    """
    Is a wrapper around the get_data function, specifically tailored for retrieving
    and processing job data based on user role and role_id.
    :param request: The incoming HTTP request object.
    :return: A JSON response containing the processed job data and renamed columns, or an error
             response if the request or token is invalid.
    """
    return get_data(request, get_jobs_for_role, {'id': 'job_id'})


def send_invoice(request):
    """
    Sends invoices with the specified data in the POST request containing ids to the email of the user.
    The request should contain a JSON body with the following fields:
    - 'ids': The ids of the invoices.
    If the provided ids are valid the function returns a JSON response with a success status.
    If the ids are missing, it returns a JSON response indicating the reason for failure.
    :param request: The HTTP request object.
    :return: A JSON response indicating the success of the start of the invoice generation.
    """
    def generate_invoices(order_ids: List[int]):
        """
        Generate for ech id in order_ids a invoice and sent it to the email of the user.
        :param order_ids: List of order_ids.
        """
        files = []
        for order_id in order_ids:
            file_name = f'invoice_order{order_id}.pdf'
            file = os.path.join(PROJECT_DIR, 'resources', file_name)
            invoice = InvoiceView(order_id)
            invoice.generate_invoice(filepath=os.path.join(PROJECT_DIR, 'resources', file_name))
            files.append((file_name, file))

        EmailService.send_mail(email, get_translation('email_title_invoice'),
                               get_translation('email_body_invoice'), files)
        for file in files:
            os.remove(file[1])

    data = validate_json_post_request(request)
    if not data:
        return JsonResponse({'success': False, 'message': f'Request does not match expected form.'}, status=400)

    token = validate_token(data.get('token', ''))
    if not token:
        return JsonResponse({'success': False, 'message': 'Not a valid token.'}, status=401)

    role = token.get('role')
    role_id = token.get('role_id')
    username = token.get('username')
    email = UserService.get_user_per_name(username, columns=['email'])
    order_ids = {int(order_id) for order_id in data.get('ids')}
    if order_ids:
        all_role_order_ids = set(get_orders_for_role(role, role_id)['id'].tolist())
        if order_ids.issubset(all_role_order_ids):
            invoice_thread = threading.Thread(target=generate_invoices, args=(order_ids,))
            invoice_thread.start()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'message': f'Some ids do not belong to requestor.'}, status=400)
    else:
        return JsonResponse({'success': False, 'message': f'Invalid body.'}, status=400)


def send_report(request):
    """
    Sends reports with the specified data in the POST request containing ids and configurations
    to the email of the user.
    The request should contain a JSON body with the following fields:
    - 'ids': The ids of the jobs.
    - 'configurations': The configurations for the report.
    If the provided ids and configurations are valid the function returns a JSON response with a success status.
    If the ids are missing or the configurations are invalid, it returns a JSON response indicating the
    reason for failure.
    :param request: The HTTP request object.
    :return: A JSON response indicating the success of the start of the report generation.
    """

    def convert_configuration(config: dict):
        """
        Converts the provided configuration data into a format suitable for report generation.
        :param config: The configuration data in dictionary format.
        :return: The converted configuration in a specific format.
        """
        converted_config = {}
        for key, subsections in config.items():
            for subsection, value in subsections.items():
                conv_section = converted_config.setdefault(key, {'sections': []})
                conv_section['sections'].append(subsection)
                if isinstance(value, dict):
                    for inner_key, inner_value in value.items():
                        if str(inner_key).endswith('number'):
                            try:
                                value[inner_key] = int(inner_value)
                            except ValueError:
                                return
                    conv_section[subsection] = value
        print(converted_config)
        return converted_config

    def generate_reports(job_ids: List[int], configuration: dict):
        """
        Generate for ech id in jobs_ids a report with configuration and send it to the email of the user.
        :param job_ids: List of job_ids
        :param configuration: configuration to use.
        """
        files = []
        for job_id in job_ids:
            file_name = f'report_job{job_id}'
            file = os.path.join(PROJECT_DIR, 'resources', file_name)
            report = Report(job_id)
            report.generate(configuration, filepath=file)
            files.append((f"{file_name}.pdf", f"{file}.pdf"))

        EmailService.send_mail(email, get_translation('email_title_report'),
                               get_translation('email_body_report'), files)
        for file in files:
            os.remove(file[1])

    data = validate_json_post_request(request)
    if not data:
        return JsonResponse({'success': False, 'message': f'Request does not match expected form.'}, status=400)

    token = validate_token(data.get('token', ''))
    if not token:
        return JsonResponse({'success': False, 'message': 'Not a valid token.'}, status=401)

    role = token.get('role')
    role_id = token.get('role_id')
    username = token.get('username')
    email = UserService.get_user_per_name(username, columns=['email'])
    job_ids = {int(job_id) for job_id in data.get('ids')}
    configuration = convert_configuration(data.get('configurations'))
    if job_ids and configuration:
        all_role_job_ids = set(get_jobs_for_role(role, role_id)['id'].tolist())
        if job_ids.issubset(all_role_job_ids):
            report_thread = threading.Thread(target=generate_reports, args=(job_ids, configuration))
            report_thread.start()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'message': 'Some ids do not belong to requestor.'}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid body.'}, status=400)


def sign_in(request: HttpRequest) -> JsonResponse:
    """
    Authenticate a user based on a POST request containing username and password.
    Handles a POST request for user authentication. The request should
    contain a JSON body with the following fields:
    - 'username': The username of the user attempting to sign in.
    - 'passwordHash': The hash of the user's password for authentication.
    If the provided username and password hash match a user's credentials in the database,
    the function returns a JSON response with a success status and an authentication token.
    If the provided credentials are invalid, it returns a JSON response indicating the
    reason for failure.
    :param request: The HTTP request object.
    :return: A JSON response indicating the success of the authentication or any errors
             that occurred during the sign-in process.
    """
    data = validate_json_post_request(request)
    if not data:
        return JsonResponse({'success': False, 'errors': {'usernameNotPresent': True, 'passwordWrong': True},
                             'message': 'Request does not match expected form.'}, status=400)

    if username := data.get('username'):
        db_password_hash, role = UserService.get_user_per_name(username, ['password', 'role'])
        if db_password_hash:
            password = data.get('passwordHash', '')
            if db_password_hash == generate_sha512_hash(password):
                role_id = UserService.get_role_id(username, role)
                token = generate_token(username, db_password_hash)
                TOKEN_STORE[token] = {'username': username, 'role': role, 'role_id': int(role_id),
                                      'timestamp': time.time()}
                return JsonResponse({'success': True, 'token': token,
                                     'errors': {'usernameNotPresent': False, 'passwordWrong': False}})
            else:
                return JsonResponse({'success': False, 'errors': {'usernameNotPresent': False, 'passwordWrong': True}})
        else:
            return JsonResponse({'success': False, 'errors': {'usernameNotPresent': True, 'passwordWrong': False}})
    else:
        return JsonResponse({'success': False, 'errors': {'usernameNotPresent': True, 'passwordWrong': True}})


def change_account(request: HttpRequest) -> JsonResponse:
    """
    Change user account information based on a POST request. Handles a POST request to change user account information,
    including updating the user's email and password. The request must contain a JSON body with the
    following fields:
    - 'oldPasswordHash': The hash of the user's old password for authentication.
    - 'newEmail': (Optional) The new email address to update.
    - 'newPasswordHash': (Optional) The new password hash to update.
    If the old password provided in 'oldPasswordHash' matches the stored password hash
    for the user with the specified 'username', the function attempts to update the user's
    account information.
    :param request: The HTTP request object.
    :return: A JSON response indicating the success of the account update or any errors that occurred.
    """
    data = validate_json_post_request(request)
    if not data:
        return JsonResponse(
            {'success': False, 'errors': {'passwordWrong': False}, 'message': 'Request does not match expected form.'},
            status=400)

    token = validate_token(data.get('token', ''))
    if not token:
        return JsonResponse({'success': False, 'errors': {'passwordWrong': False}, 'message': 'Not a valid token.'}, status=401)

    username = token.get('username')
    if db_password_hash := UserService.get_user_per_name(username, ['password']):
        old_password = data.get('oldPasswordHash', '')
        if generate_sha512_hash(old_password) == db_password_hash:
            attributes = {}
            if new_email := data.get('newEmail'):
                attributes['email'] = new_email
            if new_password := data.get('newPasswordHash'):
                attributes['password'] = generate_sha512_hash(new_password)
            succ = UserService.update_user(username, attributes)
            if succ:
                return JsonResponse({'success': True, 'errors': {'passwordWrong': False}})
            else:
                return JsonResponse({'success': False, 'errors': {'passwordWrong': False}})
        else:
            return JsonResponse({'success': False, 'errors': {'passwordWrong': True}})
    else:
        return JsonResponse({'success': False, 'errors': {'passwordWrong': False},
                             'message': 'username stored in session does not exist in db.'}, status=400)
