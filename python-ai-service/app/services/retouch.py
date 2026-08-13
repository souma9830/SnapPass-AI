"""
retouch.py — Subtle image retouching and blemish removal.

Lightweight, dependency-light retouch pipeline (OpenCV only) for
portrait photos:

1. Blemish removal: morphological dark/white top-hat operators catch
   small spots (dark pimples near skin tones, bright specks), only
   small connected components are kept (area 2..60 px), the mask is
   dilated + feathered, and the spots are filled with cv2.inpaint
   (Telea). Larger features (moles, eyes, teeth) are never touched.
2. Subtle retouch: gentle bilateral filter (edge preserving, skin
   texture smoothing) blended in proportion to `intensity`.
"""

import cv2
import numpy as np


def _decode_bgr(image_bytes: bytes) -> np.ndarray:
    image = cv2.imdecode(np.frombuffer(image_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Unable to decode the uploaded image.")
    return image


def _encode_png(bgr: np.ndarray) -> bytes:
    ok, buffer = cv2.imencode(".png", bgr)
    if not ok:
        raise ValueError("Unable to encode the processed image.")
    return buffer.tobytes()


def _spot_mask(bgr: np.ndarray, max_spot_area: int = 60) -> np.ndarray:
    """Small dark/bright spots as a dilated, feathered mask."""
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

    dark_spots = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)
    bright_spots = cv2.morphologyEx(gray, cv2.MORPH_TOPHAT, kernel)

    threshold = max(18, int(np.std(gray) * 0.8))
    spots = ((dark_spots > threshold) | (bright_spots > threshold)).astype(np.uint8) * 255

    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(spots, 8)
    small = np.zeros_like(spots)
    for label_id in range(1, num_labels):
        area = stats[label_id, cv2.CC_STAT_AREA]
        if 2 <= area <= max_spot_area:
            small[labels == label_id] = 255

    if not np.any(small):
        return np.zeros_like(spots)

    kernel_small = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    dilated = cv2.dilate(small, kernel_small, iterations=1)
    feather = cv2.GaussianBlur(dilated.astype(np.float32), (0, 0), 1.5)
    feather = (np.clip(feather * 2.0, 0, 255)).astype(np.uint8)
    return feather


def retouch_portrait(image_bytes: bytes, intensity: float = 1.0) -> bytes:
    """
    Retouch a portrait: inpaint small blemishes and apply a subtle
    skin-smoothing retouch.

    Args:
        image_bytes: Raw bytes of the input image (any OpenCV-decodable format).
        intensity:   Retouch strength in [0, 1]; 0 disables processing.

    Returns:
        PNG bytes of the processed image.

    Raises:
        ValueError: If the image cannot be decoded.
    """
    bgr = _decode_bgr(image_bytes)
    intensity = max(0.0, min(1.0, float(intensity)))
    if intensity <= 0:
        return _encode_png(bgr)

    spot_mask = _spot_mask(bgr)
    if np.any(spot_mask):
        bgr = cv2.inpaint(bgr, spot_mask, 3, cv2.INPAINT_TELEA)

    smoothed = cv2.bilateralFilter(
        bgr,
        d=7,
        sigmaColor=30 * intensity,
        sigmaSpace=30 * intensity,
    )
    weight = 0.45 * intensity
    bgr = cv2.addWeighted(smoothed, weight, bgr, 1.0 - weight, 0)
    return _encode_png(bgr)