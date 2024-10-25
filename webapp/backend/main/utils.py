from io import BytesIO

import base64

import cv2
from PIL import Image

import numpy as np

from django.http import HttpRequest


def get_base64(request: HttpRequest) -> str:
    io_image = get_io(request)
    return io_image2base64(io_image)


def get_io(request: HttpRequest) -> BytesIO:
    bgr = get_bgr(request)
    rgb = bgr2rgb(bgr)
    image = rgb2image(rgb)
    return image2io_image(image)


def get_bgr(request: HttpRequest) -> np.array:
    image_bytes = request.FILES['file'].read()
    return cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_UNCHANGED)


def io_image2base64(io_image: BytesIO) -> str:
    return 'data:image/jpeg;base64,' + base64.b64encode(io_image.getvalue()).decode('utf-8')


def image2io_image(image: Image.Image) -> BytesIO:
    io_image = BytesIO()
    image.save(io_image, format="JPEG")

    return io_image


def rgb2image(rgb: np.array) -> Image.Image:
    return Image.fromarray(rgb.astype('uint8'), 'RGB')


def bgr2rgb(bgr: np.array) -> np.array:
    return cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
