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


@patch("cv2.CascadeClassifier.detectMultiScale")
@patch("PIL.Image.open")
@patch("os.path.exists")
def test_apply_attire_swap_unsupported_attire_rejected(mock_exists, mock_image_open, mock_detect):
    # Face detected, but the requested attire template does not exist
    mock_detect.return_value = np.array([[50, 50, 100, 100]])
    mock_exists.return_value = False

    user_foreground = Image.new("RGBA", (300, 400), (255, 0, 0, 255))

    with pytest.raises(ValueError) as excinfo:
        apply_attire_swap(user_foreground, "not_a_real_style")

    assert "not_a_real_style" in str(excinfo.value)
    assert "not found" in str(excinfo.value)


@patch("cv2.CascadeClassifier.detectMultiScale")
@patch("PIL.Image.open")
@patch("os.path.exists")
def test_apply_attire_swap_multiple_faces_picks_largest(mock_exists, mock_image_open, mock_detect):
    # Two faces; the second (larger) bounding box must win the max-area pick
    mock_detect.return_value = np.array([
        [10, 10, 60, 60],
        [50, 50, 120, 120],
    ])
    mock_exists.return_value = True
    mock_image_open.return_value = Image.new("RGBA", (200, 200), (0, 255, 0, 255))

    user_foreground = Image.new("RGBA", (300, 400), (255, 0, 0, 255))

    result = apply_attire_swap(user_foreground, "male_suit")

    assert isinstance(result, Image.Image)
    assert result.size == (300, 400)
    assert result.mode == "RGBA"


@patch("cv2.CascadeClassifier.detectMultiScale")
@patch("PIL.Image.open")
@patch("os.path.exists")
def test_attire_template_path_is_loaded(mock_exists, mock_image_open, mock_detect):
    mock_detect.return_value = np.array([[50, 50, 100, 100]])
    mock_exists.return_value = True
    mock_image_open.return_value = Image.new("RGBA", (200, 200), (0, 255, 0, 255))

    user_foreground = Image.new("RGBA", (300, 400), (255, 0, 0, 255))
    apply_attire_swap(user_foreground, "male_suit")

    opened_path = mock_image_open.call_args[0][0]
    assert opened_path.endswith(os.path.join("attire", "male_suit.png"))


@patch("PIL.Image.Image.resize")
@patch("cv2.CascadeClassifier.detectMultiScale")
@patch("PIL.Image.open")
@patch("os.path.exists")
def test_attire_template_scaling_tracks_face_bounding_box(
    mock_exists, mock_image_open, mock_detect, mock_resize
):
    # 100px-wide face at (50, 50). suit_w = int(100 * 2.6) = 260, and with a
    # 200px-wide template the scale is 1.3, so suit_h = int(200 * 1.3) = 260.
    mock_detect.return_value = np.array([[50, 50, 100, 100]])
    mock_exists.return_value = True
    mock_image_open.return_value = Image.new("RGBA", (200, 200), (0, 255, 0, 255))
    mock_resize.return_value = Image.new("RGBA", (260, 260), (0, 255, 0, 255))

    user_foreground = Image.new("RGBA", (300, 400), (255, 0, 0, 255))

    result = apply_attire_swap(user_foreground, "male_suit")

    assert isinstance(result, Image.Image)
    assert result.size == (300, 400)
    mock_resize.assert_called_once_with((260, 260), Image.Resampling.LANCZOS)
