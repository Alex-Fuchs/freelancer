import hashlib
import json
import time
from json import JSONDecodeError

import pandas as pd

from services.job_service import JobService
from services.order_service import OrderService
from webapp.backend.apps.report_generator_app.token_store import TOKEN_STORE


def generate_sha512_hash(input_text: str) -> str:
    """
    Generate a SHA-512 hash for the given input text.
    :param input_text: The input text to hash.
    :return: The SHA-512 hash of the input text as a hexadecimal string.
    """
    sha512_hash = hashlib.sha512()
    sha512_hash.update(input_text.encode('utf-8'))
    return sha512_hash.hexdigest()


def generate_token(*args) -> str:
    """
    Generate a secure token by hashing the concatenated input arguments and appending the current timestamp.
    :param args: Variable-length arguments (strings) to be concatenated and hashed.
    :return: A token string.
    """
    return generate_sha512_hash(''.join(args) + str(time.time()))


def validate_token(token_id):
    token = TOKEN_STORE.get(token_id)
    if token:
        if validate_token_timestamp(token):
            return token
        else:
            del TOKEN_STORE[token_id]


def validate_token_timestamp(token: dict):
    """
    Validate a token dictionary by checking its timestamp against the current time.

    :param token: A token dictionary containing a 'timestamp' key representing the token's creation time.
    :return: True if the token is valid (not expired), False otherwise.
    """
    username = token.get('username')
    role = token.get('role')
    role_id = token.get('role_id')
    timestamp = token.get('timestamp')
    if all([username, role, role_id, timestamp]):
        return timestamp >= time.time() - 3600
    else:
        return False


def validate_json_post_request(request) -> dict:
    """
     Validate and parse a JSON POST request body.
     :param request: The HTTP request object.
     :return: Dictionary containing the parsed JSON data if the request is a valid JSON POST request.
              Returns None if the request is not a valid JSON POST request.
     """
    if request.method == 'POST':
        try:
            return json.loads(request.body)
        except JSONDecodeError:
            pass


def get_jobs_for_role(role: str, role_id: int = None) -> pd.DataFrame:
    """
    Retrieve jobs based on the user's role and, optionally, a role_id.
    :param role: The user's role, which can be 'master', 'operator', or 'client'.
    :param role_id: An optional identifier for the user's role (operator or client).
                    If role is 'master', role_id is not used.
                    If role is 'operator' or 'client', role_id should be the operator's or client's ID.
    :return: A DataFrame containing the jobs that match the specified role and role_id.
    """
    jobs = pd.DataFrame()
    if role == 'master':
        jobs = JobService.get_all_jobs()
    elif role == 'operator':
        jobs = JobService.get_jobs_per_operator(role_id)
    elif role == 'client':
        jobs = JobService.get_jobs_per_client(role_id)

    return jobs


def get_orders_for_role(role: str, role_id: int = None) -> pd.DataFrame:
    """
    Get orders based on the user's role and, optionally, a role_id.
    :param role: The user's role, which can be 'master', 'operator', or 'client'.
    :param role_id: An optional identifier for the user's role (operator or client).
                    If role is 'master', role_id is not used.
                    If role is 'operator' or 'client', role_id should be the operator's or client's ID.
    """
    orders = pd.DataFrame()
    if role == 'master':
        orders = OrderService.get_all_orders()
    elif role == 'operator':
        orders = OrderService.get_orders_per_operator(role_id)
    elif role == 'client':
        orders = OrderService.get_orders_per_client_id(role_id)[['id', 'start_date', 'end_date']]
    return orders