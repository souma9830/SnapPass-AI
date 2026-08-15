"""
biometric_anomaly_detector.py — Multi-face & Occlusion Biometric Anomaly Detector
Built for ELUSoC 2026 / GSSOC 2026.
"""
def detect_biometric_anomalies(face_count: int, occlusion_score: float) -> dict:
    anomalies = []
    if face_count > 1:
        anomalies.append("MULTI_FACE_DETECTED")
    if face_count == 0:
        anomalies.append("NO_FACE_DETECTED")
    if occlusion_score > 0.4:
        anomalies.append("HIGH_FACIAL_OCCLUSION")

    return {
        "valid": len(anomalies) == 0,
        "face_count": face_count,
        "anomalies": anomalies
    }
