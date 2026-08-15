import numpy as np
import pytest
from app.services.specular_glare_detector import SpecularGlareDetector

def test_glare_detector_normal():
    detector = SpecularGlareDetector()
    img = np.full((100, 100, 3), 120, dtype=np.uint8)
    res = detector.detect_glare_and_shadows(img)
    assert res["passed"] is True
    assert res["glare_percentage"] == 0.0

def test_glare_detector_extreme_glare():
    detector = SpecularGlareDetector()
    img = np.full((100, 100, 3), 255, dtype=np.uint8)
    res = detector.detect_glare_and_shadows(img)
    assert res["passed"] is False
    assert res["glare_percentage"] == 100.0
