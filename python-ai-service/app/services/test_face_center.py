"""
test_face_center.py — Tests for OpenCV face detection and auto-centering.
"""

import io
import pytest
import numpy as np
from PIL import Image
from app.services.face_center import center_face, FACE_HEIGHT_RATIO, HEAD_TOP_PADDING_RATIO


def test_center_face_no_face_raises_value_error():
    """Verify ValueError is raised when no face is present in the image."""
    img = Image.new("RGB", (200, 200), color=(255, 255, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    
    with pytest.raises(ValueError, match="No face detected"):
        center_face(buf.getvalue())


def test_constants():
    """Verify facial height ratio and head top clearance constants match ICAO standard."""
    assert FACE_HEIGHT_RATIO == 0.75
    assert HEAD_TOP_PADDING_RATIO == 0.20
