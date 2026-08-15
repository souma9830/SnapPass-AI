import pytest
import numpy as np
from app.services.blurriness_detector import BlurrinessDetector

def test_blurriness_detector_sharp():
    detector = BlurrinessDetector(min_variance_threshold=100.0)
    arr = np.random.randint(0, 255, (50, 50))
    res = detector.calculate_laplacian_variance(arr)
    assert "is_sharp" in res
    assert res["variance_score"] >= 0.0