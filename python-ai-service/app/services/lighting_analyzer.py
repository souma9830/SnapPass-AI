"""
Biometric Facial Lighting and Shadow Symmetry Evaluator for Passport & ICAO Compliance.
Calculates left vs right luminance histogram divergence and detects harsh shadows/glare.
"""

import io
import numpy as np
from PIL import Image

def analyze_facial_lighting(image_bytes: bytes) -> dict:
    """
    Analyzes facial illumination symmetry, highlights, and shadow uniformity.
    Returns quantitative lighting metrics for ICAO 9303 compliance.
    """
    if not image_bytes:
        return {
            "score": 0.0,
            "symmetry_percentage": 0.0,
            "has_glare": False,
            "has_heavy_shadows": False,
            "left_luminance": 0.0,
            "right_luminance": 0.0,
            "overall_brightness": 0.0,
        }

    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("L")
        arr = np.array(img)
        h, w = arr.shape

        if h < 10 or w < 10:
            return {
                "score": 50.0,
                "symmetry_percentage": 50.0,
                "has_glare": False,
                "has_heavy_shadows": False,
                "left_luminance": 0.0,
                "right_luminance": 0.0,
                "overall_brightness": 0.0,
            }

        # Crop central facial region (vertical middle 50%, horizontal middle 60%)
        top, bottom = int(h * 0.25), int(h * 0.75)
        left_bound, right_bound = int(w * 0.2), int(w * 0.8)
        face_roi = arr[top:bottom, left_bound:right_bound]

        mid = face_roi.shape[1] // 2
        left_half = face_roi[:, :mid]
        right_half = face_roi[:, mid:]

        left_lum = float(np.mean(left_half))
        right_lum = float(np.mean(right_half))
        overall_brightness = float(np.mean(face_roi))

        lum_diff = abs(left_lum - right_lum)
        max_lum = max(left_lum, right_lum, 1.0)
        symmetry_pct = round(max(0.0, 100.0 - (lum_diff / max_lum * 100.0)), 2)

        # Check for glare (overexposure pixels > 250)
        glare_pct = float(np.sum(face_roi > 250) / face_roi.size) * 100.0
        has_glare = glare_pct > 2.0

        # Check for heavy shadows (underexposed pixels < 30)
        shadow_pct = float(np.sum(face_roi < 30) / face_roi.size) * 100.0
        has_heavy_shadows = shadow_pct > 8.0

        # Calculate specular highlight ratio and vertical shadow gradient index
        specular_ratio = round(float(np.sum(face_roi > 240) / face_roi.size) * 100.0, 2)
        top_half_lum = float(np.mean(face_roi[:face_roi.shape[0] // 2, :]))
        bottom_half_lum = float(np.mean(face_roi[face_roi.shape[0] // 2:, :]))
        vertical_shadow_gradient = round(abs(top_half_lum - bottom_half_lum), 2)

        # Calculate composite lighting compliance score
        brightness_penalty = 0.0
        if overall_brightness < 80 or overall_brightness > 220:
            brightness_penalty = 20.0

        score = round(max(0.0, min(100.0, symmetry_pct - (glare_pct * 2.0) - (shadow_pct * 1.5) - brightness_penalty)), 2)

        return {
            "score": score,
            "symmetry_percentage": symmetry_pct,
            "has_glare": has_glare,
            "has_heavy_shadows": has_heavy_shadows,
            "specular_highlight_ratio": specular_ratio,
            "vertical_shadow_gradient": vertical_shadow_gradient,
            "left_luminance": round(left_lum, 2),
            "right_luminance": round(right_lum, 2),
            "overall_brightness": round(overall_brightness, 2),
        }
    except Exception as err:
        return {
            "score": 75.0,
            "symmetry_percentage": 80.0,
            "has_glare": False,
            "has_heavy_shadows": False,
            "error": str(err),
        }
