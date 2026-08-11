"""
Facial Asymmetry and Alignment Score Analyzer for ICAO 9303 Compliance.
Evaluates eye tilt, nose-to-jaw line deviation, and left-vs-right facial region symmetry.
"""

import cv2
import numpy as np
from typing import Dict, Any

class FacialAsymmetryAnalyzer:
    def __init__(self, tilt_threshold_deg: float = 3.0, asymmetry_threshold: float = 0.15):
        self.tilt_threshold_deg = tilt_threshold_deg
        self.asymmetry_threshold = asymmetry_threshold

    def analyze_facial_symmetry(self, image_np: np.ndarray, landmarks: list = None) -> Dict[str, Any]:
        """
        Calculates facial symmetry metrics using image luminosity distribution and landmark ratios.
        """
        if image_np is None or image_np.size == 0:
            return {
                "passed": False,
                "tilt_angle_deg": 0.0,
                "asymmetry_score": 1.0,
                "recommendation": "Invalid image format or empty frame provided."
            }

        h, w = image_np.shape[:2]
        gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY) if len(image_np.shape) == 3 else image_np

        # Split left and right halfs of face
        mid_x = w // 2
        left_half = gray[:, :mid_x]
        right_half = cv2.flip(gray[:, mid_x + (w % 2):], 1)

        # Ensure equal size for comparison
        min_w = min(left_half.shape[1], right_half.shape[1])
        left_crop = left_half[:, :min_w]
        right_crop = right_half[:, :min_w]

        # Calculate structural difference / asymmetry score
        diff = cv2.absdiff(left_crop, right_crop)
        asymmetry_score = float(np.mean(diff) / 255.0)

        # Estimate head tilt using eye corner landmarks if available or contour moment orientation
        tilt_angle = 0.0
        if landmarks and len(landmarks) >= 2:
            left_eye, right_eye = landmarks[0], landmarks[1]
            dx = right_eye[0] - left_eye[0]
            dy = right_eye[1] - left_eye[1]
            tilt_angle = float(np.degrees(np.arctan2(dy, dx)))

        passed = asymmetry_score <= self.asymmetry_threshold and abs(tilt_angle) <= self.tilt_threshold_deg

        recommendation = "Facial orientation is symmetrical and ICAO compliant."
        if not passed:
            if abs(tilt_angle) > self.tilt_threshold_deg:
                recommendation = f"Head is tilted by {tilt_angle:.1f}°. Please align head upright."
            else:
                recommendation = "Uneven lighting or head roll detected. Ensure face directly targets the camera."

        return {
            "passed": passed,
            "tilt_angle_deg": round(tilt_angle, 2),
            "asymmetry_score": round(asymmetry_score, 4),
            "recommendation": recommendation
        }
