"""
face_detection.py — Shared face detection helper.

Uses OpenCV's Haar cascade classifier to detect the largest face
in a grayscale image.  All services that need face detection should
import from this module instead of rebuilding the cascade locally.
"""

import cv2


def detect_largest_face(gray_image: cv2.Mat):
    """Run OpenCV Haar cascade on a grayscale image.

    Args:
        gray_image: A grayscale OpenCV Mat.

    Returns:
        Tuple (x, y, w, h) of the largest detected face, or None if
        no face was found.
    """
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = cascade.detectMultiScale(
        gray_image,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(60, 60),
    )

    if len(faces) == 0:
        return None

    return max(faces, key=lambda rect: rect[2] * rect[3])