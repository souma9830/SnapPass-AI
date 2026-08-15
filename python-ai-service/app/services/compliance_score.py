"""
Composite Passport Compliance Scoring Module
Calculates an aggregate compliance index (0-100%) based on face resolution,
blur score, head ratio, and background uniformity.
"""

from typing import Dict, Any

__all__ = ["calculate_composite_score"]

def calculate_composite_score(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Given a set of image quality metrics, compute individual aspect scores
    and a final weighted composite compliance score with letter grading and recommendations.
    """
    blur_score = metrics.get("blur_score", 100.0)
    face_width = metrics.get("face_width", 350)
    face_height = metrics.get("face_height", 450)
    background_uniformity = metrics.get("background_uniformity", 90.0)
    head_ratio = metrics.get("head_ratio", 0.75)
    roll_deg = abs(metrics.get("roll_deg", 0.0))
    lighting_diff = metrics.get("lighting_diff", 0.0)
    
    # 1. Blur Score Component (max score at blur_score >= 120)
    blur_component = min(100.0, max(0.0, (blur_score / 120.0) * 100.0))

    # 2. Resolution Component (max score at face_width >= 300 & height >= 375)
    res_component = min(100.0, max(0.0, (face_width / 300.0) * 50.0 + (face_height / 375.0) * 50.0))

    # 3. Background Uniformity Component
    bg_component = min(100.0, max(0.0, background_uniformity))

    # 4. Head Ratio Component (ideal: 0.65-0.80)
    if 0.65 <= head_ratio <= 0.80:
        ratio_component = 100.0
    else:
        ratio_component = max(0.0, 100.0 - abs(head_ratio - 0.72) * 200.0)

    # 5. Pose / Roll Tilt Component (ideal roll <= 3 deg)
    tilt_component = max(0.0, 100.0 - (roll_deg * 15.0))

    # 6. Lighting Uniformity Component (diff <= 35)
    lighting_component = max(0.0, 100.0 - (lighting_diff * 1.5))

    # Weighted aggregate score
    overall_score = round(
        0.25 * blur_component + 
        0.25 * res_component + 
        0.15 * bg_component + 
        0.15 * ratio_component + 
        0.10 * tilt_component + 
        0.10 * lighting_component, 
        1
    )
    
    if overall_score >= 90.0:
        grade = "A+"
        status = "EXCELLENT"
    elif overall_score >= 80.0:
        grade = "A"
        status = "PASS"
    elif overall_score >= 65.0:
        grade = "B"
        status = "ACCEPTABLE"
    else:
        grade = "F"
        status = "FAIL"

    recommendations = []
    if blur_component < 75.0:
        recommendations.append("Image is slightly blurry; ensure optimal camera focus or lighting.")
    if res_component < 75.0:
        recommendations.append("Face resolution is low; move closer to camera or use higher resolution.")
    if bg_component < 70.0:
        recommendations.append("Background contains noise or shadows; use auto-background remover.")
    if tilt_component < 80.0:
        recommendations.append("Head pose is tilted; keep head upright and align with vertical axis.")
    if lighting_component < 70.0:
        recommendations.append("Uneven facial lighting detected; adjust frontal lighting.")

    return {
        "overall_score": overall_score,
        "grade": grade,
        "status": status,
        "breakdown": {
            "blur_rating": round(blur_component, 1),
            "resolution_rating": round(res_component, 1),
            "background_rating": round(bg_component, 1),
            "head_ratio_rating": round(ratio_component, 1),
            "tilt_rating": round(tilt_component, 1),
            "lighting_rating": round(lighting_component, 1),
        },
        "recommendations": recommendations,
    }

