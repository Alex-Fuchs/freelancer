import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import cv2

from django.http import JsonResponse, HttpRequest
from rest_framework.decorators import api_view

import main.prediction as p
import main.utils as u

predictor = p.Predictor()


@api_view(['POST'])
def photo_rater(request: HttpRequest) -> JsonResponse:
    bgr = u.get_bgr(request)

    predictions_face = predictor.facial_beauty(bgr, captions=["attractive", "ugly"])
    predictions_human = []

    if len(predictions_face) > 0:
        for score, bbox in predictions_face:
            cv2.rectangle(bgr, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (255, 255, 255), 2)

        if len(predictions_face) == 1 and predictions_face[0][0] is not None:
            predictions_human = predictor.physical_beauty(bgr, captions=["attractive", "ugly"])

            if len(predictions_human) == 1:
                for score, bbox in predictions_human:
                    cv2.rectangle(bgr, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (255, 255, 255), 2)

    return JsonResponse({
        'image': u.io_image2base64(u.image2io_image(u.rgb2image(u.bgr2rgb(bgr)))),
        'facial_scores': predictions_face,
        'physical_scores': predictions_human
    })


@api_view(['POST'])
def face_enhancer(request: HttpRequest) -> JsonResponse:
    io_image = u.get_io(request)
    pass


@api_view(['POST'])
def bio_creator(request: HttpRequest) -> JsonResponse:
    text = request.POST['text']

    if 50 < len(text) < 1000:
        if 'file' in request.FILES:
            base64_image = u.get_base64(request)

            prompt = f'Generate an online dating bio with 15 to 30 words for a person with following description: {text}.'\
                     f' Also use the uploaded image which shows the person.' \
                     f' If not enough information is given, use random information.' \
                     f' Only output the bio and use the language of the description:'

            response = predictor.text_generation_with_image(base64_image, prompt)
        else:
            prompt = f'Generate an online dating bio with 15 to 30 words for a person with following description: {text}.' \
                     f' If not enough information is given, use random information.' \
                     f' Only output the bio and use the language of the description:'

            response = predictor.text_generation(prompt)

        return JsonResponse({'response': response})
    else:
        return JsonResponse({'response': None})


@api_view(['POST'])
def message_suggestor(request: HttpRequest) -> JsonResponse:
    base64_image = u.get_base64(request)

    prompt = 'Only output the chat and add the writer (me or him/her) in front of messages:'

    chat = predictor.text_generation_with_image(base64_image, prompt)

    prompt = f'Generate the next message with 5 to 15 words for following chat: {chat}.' \
             f' Only output the message and use the language of the chat:'

    response = predictor.text_generation(prompt)

    return JsonResponse({'response': response[8:]})


@api_view(['POST'])
def contact(request: HttpRequest) -> JsonResponse:
    prename = request.POST['prename']
    surname = request.POST['surname']
    email = request.POST['email']
    organization = request.POST['organization']
    message = request.POST['message']

    msg = MIMEMultipart()
    msg['Subject'] = f'Message: {prename}, {surname}, {email}, {organization}'
    msg['From'] = 'webmaster@more-matches.com'
    msg['To'] = 'fuchs.ali@gmail.com'
    msg.attach(MIMEText(message))

    s = smtplib.SMTP_SSL('smtp.strato.de:465')
    s.login('webmaster@more-matches.com', )
    s.sendmail('webmaster@more-matches.com', 'fuchs.ali@gmail.com', msg.as_string())
    s.quit()

    return JsonResponse({})
