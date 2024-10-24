import math
from typing import List

import cv2
from PIL import Image

import numpy as np
import torch
import torch.nn as nn

import clip
from deepface import DeepFace
from openai import OpenAI
from transformers import pipeline
from ultralytics import YOLO


class Predictor(nn.Module):
    def __init__(self):
        super().__init__()

        self.object_detector = YOLO("yolov8n.pt")
        self.age_detector = pipeline("image-classification", model="dima806/facial_age_image_detection")
        self.clip, self.clip_preprocess = clip.load("ViT-B/32")

        self.openai = OpenAI()

    @torch.no_grad()
    def predict_visual_generation(self, base64_image: str, prompt: str):
        response = self.openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": base64_image
                            },
                        },
                    ],
                }
            ],
        )

        return response.choices[0]

    def predict_text_generation(self, prompt: str):
        completion = self.openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
        )

        return completion.choices[0].message.content

    @torch.no_grad()
    def predict_clip(self, image: Image.Image, captions: List[str]):
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
    def predict_facial_beauty(self, bgr: np.array, captions: List[str]):
        faces = DeepFace.extract_faces(bgr, detector_backend='retinaface', expand_percentage=20, normalize_face=False, enforce_detection=False)

        result = []
        for face in faces:
            bbox = face['facial_area']
            bbox = (bbox['x'], bbox['y'], bbox['x'] + bbox['w'], bbox['y'] + bbox['h'])

            face = Image.fromarray(face['face'].astype('uint8'), 'RGB')

            age = int(self.age_detector(face)[0]['label'].split('-')[-1])
            score = round(self.predict_clip(face, captions)[0][0] * 9 + 1, 1)

            if (age >= 14 and score > 7) or (age >= 16 and score > 5.5) or (age >= 18 and score > 4) or age >= 21:
                result.append((score, bbox))
            else:
                result.append((None, bbox))

        return result

    @torch.no_grad()
    def predict_physical_beauty(self, bgr: np.array, captions: List[str]):
        detections = self.object_detector(bgr)[0].boxes.data.tolist()
        human_detections = [(math.ceil(x1), math.ceil(y1), math.ceil(x2), math.ceil(y2)) for x1, y1, x2, y2, conf, cid in detections if cid == 0]

        result = []
        for human_detection in human_detections:
            human = bgr[human_detection[1]:human_detection[3], human_detection[0]:human_detection[2]]
            human = cv2.cvtColor(human, cv2.COLOR_BGR2RGB)
            human = Image.fromarray(human.astype('uint8'), 'RGB')

            score = round(self.predict_clip(human, captions)[0][0] * 9 + 1, 1)

            result.append((score, human_detection))

        return result
