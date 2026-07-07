import pytest
import cv2
import numpy as np
import os
from app.services.compliance_inspector import inspect_compliance

def test_inspect_compliance_nonexistent():
    report = inspect_compliance("nonexistent_file.jpg")
    assert report["passed"] is False
    assert report["hard_fail"] is True
    assert any(item["id"] == "image_read" for item in report["items"])

def test_inspect_compliance_no_face(tmp_path):
    img_h, img_w = 400, 300
    image = np.ones((img_h, img_w, 3), dtype=np.uint8) * 255
    
    test_file = str(tmp_path / "test_no_face.jpg")
    cv2.imwrite(test_file, image)
    
    report = inspect_compliance(test_file, "35x45")
    
    assert report["passed"] is False
    assert report["hard_fail"] is True
    assert any(item["id"] == "face" for item in report["items"])
