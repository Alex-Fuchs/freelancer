from io import BytesIO

import math
from typing import List

from PIL import Image

import numpy as np
import torch
import torch.nn as nn

import clip
from deepface import DeepFace
from openai import OpenAI
from transformers import pipeline
from ultralytics import YOLO

import main.utils as u


class Predictor(nn.Module):
    def __init__(self):
        super().__init__()

        self.object_detector = YOLO("yolov8n.pt")
        self.age_detector = pipeline("image-classification", model="dima806/facial_age_image_detection")
        self.clip, self.clip_preprocess = clip.load("ViT-B/32")

        self.openai = OpenAI()

    def image_generation_with_image(self, io_image: BytesIO, prompt: str):
        response = self.openai.images.edit(
            model="dall-e-2",
            image=io_image,
            prompt=prompt,
            mask=open("mask.png", "rb"),
            n=1,
            response_format='b64_json',
            size="1024x1024"
        )

        image_url = response.data[0].url

    def text_generation_with_image(self, base64_image: str, prompt: str):
        response = self.openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user",
                 "content": [
                     {"type": "text", "text": prompt},
                     {"type": "image_url",
                      "image_url": {
                          "url": base64_image
                      },
                      },
                 ],
                 }
            ],
        )

        return response.choices[0]

    def text_generation(self, prompt: str):
        completion = self.openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
        )

        return completion.choices[0].message.content

    @torch.no_grad()
    def clip(self, image: Image.Image, captions: List[str]):
        captions = clip.tokenize(captions)
        text_features = self.clip.encode_text(captions)
        text_features /= text_features.norm(dim=1, keepdim=True)

        image = self.clip_preprocess(image).unsqueeze(0)
        image_features = self.clip.encode_image(image)
        image_features /= image_features.norm(dim=1, keepdim=True)

        logit_scale = self.clip.logit_scale.exp()
        logits_per_image = logit_scale * image_features @ text_features.t()

        probs = logits_per_image.softmax(dim=-1).numpy()

        return probs

    @torch.no_grad()
    def facial_beauty(self, bgr: np.array, captions: List[str]):
        faces = DeepFace.extract_faces(bgr, detector_backend='retinaface', expand_percentage=20, normalize_face=False, enforce_detection=False)

        result = []
        for face in faces:
            bbox = face['facial_area']
            bbox = (bbox['x'], bbox['y'], bbox['x'] + bbox['w'], bbox['y'] + bbox['h'])

            age = int(self.age_detector(u.rgb2image(face['face']))[0]['label'].split('-')[-1])
            score = round(self.clip(face, captions)[0][0] * 9 + 1, 1)

            if (age >= 14 and score > 7) or (age >= 16 and score > 5.5) or (age >= 18 and score > 4) or age >= 21:
                result.append((score, bbox))
            else:
                result.append((None, bbox))

        return result

    @torch.no_grad()
    def physical_beauty(self, bgr: np.array, captions: List[str]):
        bboxes = self.object_detector(bgr)[0].boxes.data.tolist()
        human_bboxes = [(math.ceil(x1), math.ceil(y1), math.ceil(x2), math.ceil(y2)) for x1, y1, x2, y2, conf, cid in bboxes if cid == 0]

        result = []
        for bbox in human_bboxes:
            human = bgr[bbox[1]:bbox[3], bbox[0]:bbox[2]]

            score = round(self.clip(u.rgb2image(u.bgr2rgb(human)), captions)[0][0] * 9 + 1, 1)

            result.append((score, bbox))

        return result
