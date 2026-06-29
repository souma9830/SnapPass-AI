import pytest
from unittest.mock import patch, MagicMock
from PIL import Image
import numpy as np
import io
import os
from app.services.attire_swap import apply_attire_swap

@patch("cv2.CascadeClassifier.detectMultiScale")
@patch("PIL.Image.open")
@patch("os.path.exists")
def test_apply_attire_swap_success(mock_exists, mock_image_open, mock_detect):
    # Mock face detection: returns 1 face rectangle
    mock_detect.return_value = np.array([[50, 50, 100, 100]])
    
    # Mock template exists
    mock_exists.return_value = True
    
    # Create dummy template image (RGBA)
    dummy_template = Image.new("RGBA", (200, 200), (0, 255, 0, 255))
    mock_image_open.return_value = dummy_template
    
    # Create user foreground (RGBA)
    user_foreground = Image.new("RGBA", (300, 400), (255, 0, 0, 255))
    
    # Run the swap service
    result = apply_attire_swap(user_foreground, "male_suit")
    
    # Assertions
    assert isinstance(result, Image.Image)
    assert result.size == (300, 400)
    assert result.mode == "RGBA"
    
    # Ensure template image was loaded
    mock_image_open.assert_called_once()
    
    # Ensure face detection was run
    mock_detect.assert_called_once()

@patch("cv2.CascadeClassifier.detectMultiScale")
def test_apply_attire_swap_no_face_fails(mock_detect):
    # Mock face detection: no faces found
    mock_detect.return_value = np.array([])
    
    # Create user foreground
    user_foreground = Image.new("RGBA", (300, 400), (255, 0, 0, 255))
    
    # Expect ValueError due to no face detected
    with pytest.raises(ValueError) as excinfo:
        apply_attire_swap(user_foreground, "male_suit")
        
    assert "Could not detect face" in str(excinfo.value)
