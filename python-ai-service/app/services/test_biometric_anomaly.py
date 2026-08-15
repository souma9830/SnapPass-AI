"""
test_biometric_anomaly.py — Biometric Anomaly Detector Tests
Built for ELUSoC 2026 / GSSOC 2026.
"""
from app.services.biometric_anomaly_detector import detect_biometric_anomalies

def test_multi_face_anomaly():
    res = detect_biometric_anomalies(2, 0.1)
    assert res["valid"] is False
    assert "MULTI_FACE_DETECTED" in res["anomalies"]
