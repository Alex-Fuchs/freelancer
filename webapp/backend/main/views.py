from io import BytesIO
import base64

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import cv2
from PIL import Image

import numpy as np

from django.http import JsonResponse, HttpRequest
from rest_framework.decorators import api_view

import main.prediction as p

predictor = p.Predictor()


@api_view(['POST'])
def photo_rater(request: HttpRequest) -> JsonResponse:
    image_bytes = request.FILES['file'].read()
    bgr = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_UNCHANGED)

    predictions_face = predictor.predict_facial_beauty(bgr, captions=["attractive", "ugly"])

    if len(predictions_face) > 0:
        for score, bbox in predictions_face:
            cv2.rectangle(bgr, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (255, 255, 255), 2)

        if len(predictions_face) == 1 and predictions_face[0][0] is not None:
            predictions_human = predictor.predict_physical_beauty(bgr, captions=["attractive", "ugly"])

            if len(predictions_human) == 1:
                cv2.rectangle(bgr, (predictions_human[0][1][0], predictions_human[0][1][1]), (predictions_human[0][1][2], predictions_human[0][1][3]),
                              (255, 255, 255), 2)
            else:
                predictions_human = []
        else:
            predictions_human = []
    else:
        predictions_human = []

    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    rgb = Image.fromarray(rgb.astype('uint8'), 'RGB')

    buffered = BytesIO()
    rgb.save(buffered, format="JPEG")

    return JsonResponse({
        'image': 'data:image/jpeg;base64,' + base64.b64encode(buffered.getvalue()).decode('utf-8'),
        'facial_scores': predictions_face,
        'physical_scores': predictions_human
    })


@api_view(['POST'])
def face_enhancer(request: HttpRequest) -> JsonResponse:
    pass


@api_view(['POST'])
def bio_creator(request: HttpRequest) -> JsonResponse:
    text = request.POST['text']

    if 50 < len(text) < 1000:
        prompt = f'Generate an online dating bio with 15 to 30 words for a person with following description: {text}.' \
                 f' If not enough information is given, use random information to create the bio.' \
                 f' Only output the bio and use the language of the description:'

        response = predictor.predict_text_generation(prompt)

        return JsonResponse({'response': response})
    else:
        return JsonResponse({'response': None})


@api_view(['POST'])
def message_suggestor(request: HttpRequest) -> JsonResponse:
    image_bytes = request.FILES['file'].read()
    bgr = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_UNCHANGED)
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(rgb.astype('uint8'), 'RGB')

    buffered = BytesIO()
    image.save(buffered, format="JPEG")

    base64_image = 'data:image/jpeg;base64,' + base64.b64encode(buffered.getvalue()).decode('utf-8')

    chat = predictor.predict_visual_generation(base64_image, 'Only output the chat and add the writer (me or him/her) in front of messages:')
    print(chat)

    prompt = f'Generate the next message with 5 to 15 words for following chat: {chat}.' \
             f' If no chat is given, output that no chat has been found.' \
             f' Only output the message and use the language of the chat:'

    response = predictor.predict_text_generation(prompt)

    return JsonResponse({'response': response})


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
