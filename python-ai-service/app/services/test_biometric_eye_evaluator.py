import pytest
from app.services.biometric_eye_evaluator import BiometricEyeDistanceEvaluator

@pytest.fixture
def evaluator():
    return BiometricEyeDistanceEvaluator(min_ratio=0.20, max_ratio=0.45)

def test_eye_distance_compliant_case(evaluator):
    landmarks = [(150.0, 200.0), (270.0, 200.0)]
    dimensions = (500, 500)
    result = evaluator.evaluate_interocular_distance(landmarks, dimensions)
    assert result["is_compliant"] is True
    assert result["status_code"] == "PASSED"
    assert result["metrics"]["interocular_pixel_distance"] == 120.0
    assert result["metrics"]["frame_width_ratio"] == 0.24

def test_eye_distance_insufficient_landmarks(evaluator):
    landmarks = [(100.0, 100.0)]
    result = evaluator.evaluate_interocular_distance(landmarks, (500, 500))
    assert result["is_compliant"] is False
    assert result["status_code"] == "INSUFFICIENT_LANDMARKS"

def test_eye_distance_out_of_bounds_too_close(evaluator):
    landmarks = [(200.0, 200.0), (220.0, 200.0)]
    result = evaluator.evaluate_interocular_distance(landmarks, (500, 500))
    assert result["is_compliant"] is False
    assert result["status_code"] == "OUT_OF_BOUNDS"