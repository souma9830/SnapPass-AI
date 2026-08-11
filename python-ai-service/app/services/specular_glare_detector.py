"""
Specular Glare and Harsh Shadow Detector for ICAO Document Verification.
Analyzes overexposed highlights (glare on glasses/skin) and deep harsh facial shadows.
"""

import cv2
import numpy as np
from typing import Dict, Any

class SpecularGlareDetector:
    def __init__(self, glare_threshold_val: int = 250, glare_max_area_pct: float = 0.02, shadow_min_val: int = 40):
        self.glare_threshold_val = glare_threshold_val
        self.glare_max_area_pct = glare_max_area_pct
        self.shadow_min_val = shadow_min_val

    def detect_glare_and_shadows(self, image_np: np.ndarray) -> Dict[str, Any]:
        if image_np is None or image_np.size == 0:
            return {"passed": False, "glare_pct": 0.0, "shadow_pct": 0.0, "reason": "Invalid image"}

        gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY) if len(image_np.shape) == 3 else image_np
        total_pixels = gray.size

        # Highlight glare detection (overexposed pixels)
        glare_mask = cv2.threshold(gray, self.glare_threshold_val, 255, cv2.THRESH_BINARY)[1]
        glare_pixels = cv2.countNonZero(glare_mask)
        glare_pct = float(glare_pixels / total_pixels)

        # Harsh shadow detection (under-exposed facial regions)
        shadow_mask = cv2.threshold(gray, self.shadow_min_val, 255, cv2.THRESH_BINARY_INV)[1]
        shadow_pixels = cv2.countNonZero(shadow_mask)
        shadow_pct = float(shadow_pixels / total_pixels)

        passed = glare_pct <= self.glare_max_area_pct and shadow_pct <= 0.08

        status_msg = "Lighting and illumination distribution complies with ICAO standards."
        if glare_pct > self.glare_max_area_pct:
            status_msg = f"Flash reflection or glare detected ({glare_pct*100:.1f}% area). Remove eyeglasses or diffuse lighting."
        elif shadow_pct > 0.08:
            status_msg = f"Harsh directional shadow detected ({shadow_pct*100:.1f}% area). Ensure balanced ambient front light."

        return {
            "passed": passed,
            "glare_percentage": round(glare_pct * 100, 2),
            "shadow_percentage": round(shadow_pct * 100, 2),
            "recommendation": status_msg
        }
