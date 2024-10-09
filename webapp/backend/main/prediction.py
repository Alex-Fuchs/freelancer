from typing import List

import clip
import cv2
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from deepface import DeepFace
from transformers import pipeline
from ultralytics import YOLO
from openai import OpenAI


class Predictor(nn.Module):
    def __init__(self):
        super().__init__()

        self.object_detector = YOLO("yolov8n.pt")
        self.age_detector = pipeline("image-classification", model="dima806/facial_age_image_detection")

        self.text_generation = OpenAI()
        self.clip, self.clip_preprocess = clip.load("ViT-B/32")

    def predict_text_generation(self, prompt):
        completion = self.text_generation.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
        )

        return completion.choices[0].message.content

    @torch.no_grad()
    def predict_clip(self, image: Image.Image, labels: List[str]):
        labels = clip.tokenize(labels).to(self.device)
        text_features = self.clip.encode_text(labels)
        text_features /= text_features.norm(dim=1, keepdim=True)

        image = self.clip_preprocess(image).unsqueeze(0).to(self.device)
        image_features = self.clip.encode_image(image)
        image_features /= image_features.norm(dim=1, keepdim=True)

        logit_scale = self.clip.logit_scale.exp()
        logits_per_image = logit_scale * image_features @ text_features.t()

        probs = logits_per_image.softmax(dim=-1).cpu().numpy()

        return probs

    @torch.no_grad()
    def predict_facial_beauty(self, img: np.array, captions):
        faces = DeepFace.extract_faces(img, detector_backend='retinaface', expand_percentage=20, normalize_face=False)

        result = []
        for face in faces:
            bbox = face['facial_area']
            bbox = (bbox['x'], bbox['y'], bbox['x'] + bbox['w'], bbox['y'] + bbox['h'])

            face = Image.fromarray(face['face'].astype('uint8'), 'RGB')
            age = int(self.age_detector(face)[0]['label'].split('-')[-1])
            score = round(self.predict_clip(face, captions)[0][0] * 9 + 1, 1)

            if (age >= 14 and score > 7) or (age >= 16 and score > 5.5) or (age >= 18 and score > 4) or age >= 21:
                result.append((score, bbox, face))
            else:
                result.append((None, bbox, face))

        return result

    @torch.no_grad()
    def predict_physical_beauty(self, img: np.array, captions):
        detections = self.object_detector(img)[0].boxes.data.cpu().tolist()
        human_detections = [(round(x1), round(y1), round(x2), round(y2)) for x1, y1, x2, y2, conf, cid in detections if
                            cid == 0]

        result = []
        for human_detection in human_detections:
            human = img[human_detection[1]:human_detection[3], human_detection[0]:human_detection[2]]
            human = cv2.cvtColor(human, cv2.COLOR_BGR2RGB)
            human = Image.fromarray(human.astype('uint8'), 'RGB')

            score = round(self.predict_clip(human, captions)[0][0] * 9 + 1, 1)

            result.append((score, human_detection, human))

        return result
