"""
preset_compliance_engine.py — Rule-based ICAO/ISO passport photo compliance score evaluator.
"""

__all__ = ["PRESET_RULES", "PresetComplianceEngine"]

PRESET_RULES = {
    "35x45": {"min_ratio": 0.70, "max_ratio": 0.80, "bg": "light"},
    "51x51": {"min_ratio": 0.50, "max_ratio": 0.69, "bg": "white"},
    "33x48": {"min_ratio": 0.70, "max_ratio": 0.80, "bg": "light"},
    "40x60": {"min_ratio": 0.70, "max_ratio": 0.80, "bg": "white"},
    "2x2in": {"min_ratio": 0.50, "max_ratio": 0.69, "bg": "white"},
}

class PresetComplianceEngine:
    @staticmethod
    def evaluate_compliance(face_confidence: float, eye_line_ratio: float, background_uniformity: float, glare_pct: float = 0.0) -> dict:
        score = 100.0
        reasons = []

        if face_confidence < 0.80:
            penalty = max(15.0, (0.80 - face_confidence) * 50)
            score -= penalty
            reasons.append("Low face detection confidence")

        if not (0.50 <= eye_line_ratio <= 0.70):
            score -= 20.0
            reasons.append("Eye line out of optimal vertical ratio bounds (50%-70%)")

        if background_uniformity < 0.85:
            score -= 20.0
            reasons.append("Background contains noise or non-uniform shadows")

        if glare_pct > 2.0:
            score -= 15.0
            reasons.append("Specular glare detected on face or glasses")

        score = max(0.0, min(100.0, score))
        compliant = score >= 85.0

        return {
            "score": round(score, 2),
            "compliant": compliant,
            "reasons": reasons
        }

    @staticmethod
    def evaluate_preset_rules(preset_id: str, face_ratio: float) -> dict:
        rules = PRESET_RULES.get(preset_id, {"min_ratio": 0.50, "max_ratio": 0.80})
        compliant = rules["min_ratio"] <= face_ratio <= rules["max_ratio"]
        return {
            "preset_id": preset_id,
            "face_ratio": round(face_ratio, 3),
            "compliant": compliant,
            "required_min": rules["min_ratio"],
            "required_max": rules["max_ratio"],
        }
