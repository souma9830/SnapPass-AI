"""
preset_compliance_engine.py — Rule-based ICAO/ISO passport photo compliance score evaluator.
"""

class PresetComplianceEngine:
    @staticmethod
    def evaluate_compliance(face_confidence: float, eye_line_ratio: float, background_uniformity: float) -> dict:
        score = 100.0
        reasons = []

        if face_confidence < 0.80:
            penalty = (0.80 - face_confidence) * 50
            score -= penalty
            reasons.append("Low face detection confidence")

        if not (0.50 <= eye_line_ratio <= 0.70):
            score -= 15.0
            reasons.append("Eye line out of optimal vertical ratio bounds (50%-70%)")

        if background_uniformity < 0.85:
            score -= 20.0
            reasons.append("Background contains noise or non-uniform shadows")

        score = max(0.0, min(100.0, score))
        compliant = score >= 75.0

        return {
            "score": round(score, 2),
            "compliant": compliant,
            "reasons": reasons
        }
