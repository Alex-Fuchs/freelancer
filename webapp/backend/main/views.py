import base64
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from io import BytesIO

import cv2
import main.prediction as p
import numpy as np
from PIL import Image
from django.http import JsonResponse, HttpRequest
from rest_framework.decorators import api_view

predictor = p.Predictor()


@api_view(['POST'])
def photo_rater(request: HttpRequest) -> JsonResponse:
    image_bytes = request.FILES['file'].read()
    image_array = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_UNCHANGED)

    predictions_face = predictor.predict_facial_beauty(image_array, captions=["attractive", "ugly"])

    minor = False
    if len(predictions_face) > 0:
        for score, bbox, face in predictions_face:
            if score is not None:
                cv2.rectangle(image_array, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (255, 255, 255), 2)
                cv2.putText(image_array, str(score), (bbox[0] + 9, bbox[3] - 12), cv2.FONT_HERSHEY_SIMPLEX, 1,
                            (255, 255, 255), 2)
            else:
                minor = True

        if len(predictions_face) == 1 and predictions_face[0][0] is not None:
            predictions_human = predictor.predict_physical_beauty(image_array, captions=["attractive", "ugly"])

            if len(predictions_human) == 1:
                score, bbox, face = predictions_human[0]

                cv2.rectangle(image_array, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (255, 255, 255), 2)
                cv2.putText(image_array, str(score), (bbox[0] + 9, bbox[3] - 12), cv2.FONT_HERSHEY_SIMPLEX, 1,
                            (255, 255, 255), 2)

    image = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(image.astype('uint8'), 'RGB')

    buffered = BytesIO()
    image.save(buffered, format="JPEG")

    return JsonResponse({'image': base64.b64encode(buffered.getvalue()).decode('utf-8'),
                         'error': {'no_person': len(predictions_face) == 0,
                                   'multiple_person': len(predictions_face) > 1,
                                   'minor': minor}})


@api_view(['POST'])
def face_enhancer(request: HttpRequest) -> JsonResponse:
    pass


@api_view(['POST'])
def bio_creator(request: HttpRequest) -> JsonResponse:
    text = request.POST['text']

    if 75 < len(text) < 1000:
        prompt = f'Generate an online dating bio with 15 to 30 words for a person with following description: {text}.' \
                 f' If not enough information is given, use random information to create the bio.' \
                 f' Only output the bio and use the language of the description.'

        response = predictor.predict_text_generation(prompt)

        return JsonResponse({'response': response})
    else:
        raise Exception("BIO CREATOR: Too long text.")


@api_view(['POST'])
def message_suggestor(request: HttpRequest) -> JsonResponse:
    pass


@api_view(['POST'])
def home(request: HttpRequest) -> JsonResponse:
    pass


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
    s.login('webmaster@more-matches.com',)
    s.sendmail('webmaster@more-matches.com', 'fuchs.ali@gmail.com', msg.as_string())
    s.quit()

    return JsonResponse({})
