"""
red_eye_correction.py — Automated red-eye detection and correction.

Detects red pupil reflections typical of on-camera flash and corrects
them to a natural dark tone. Non-red highlights and normal skin tones
are left untouched.

Detection strategy
------------------
- Candidate pixels: red hue in HSV (H <= 10 or H >= 170) with sufficient
  saturation/brightness.
- Morphological closing + connected-component analysis to group pupil
  glints; candidates must be small, compact, roughly circular blobs
  (typical of pupils), which filters out lips, bokeh and red shirts.
- A feathered mask (Gaussian-blurred) desaturates and darkens the pupil
  so the fix blends naturally at the edges.
"""

import io

import cv2
import numpy as np


def _decode_bgr(image_bytes: bytes) -> np.ndarray:
    image = cv2.imdecode(np.frombuffer(image_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Unable to decode the uploaded image.")
    return image


def correct_red_eye(image_bytes: bytes, intensity: float = 1.0) -> bytes:
    """
    Detect and correct red-eye artefacts.

    Args:
        image_bytes: Raw bytes of the input image (any OpenCV-decodable format).
        intensity:   Correction strength in [0, 1]; 0 disables correction.

    Returns:
        PNG bytes of the corrected image.

    Raises:
        ValueError: If the image cannot be decoded.
    """
    bgr = _decode_bgr(image_bytes)
    h, w = bgr.shape[:2]

    intensity = max(0.0, min(1.0, float(intensity)))
    if intensity <= 0:
        return _encode_png(bgr)

    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)

    # Red hues sit at both ends of the HSV wheel.
    low_red = (hsv[:, :, 0] <= 10) & (hsv[:, :, 1] >= 60) & (hsv[:, :, 2] >= 60)
    high_red = (hsv[:, :, 0] >= 170) & (hsv[:, :, 1] >= 60) & (hsv[:, :, 2] >= 60)
    candidate = (low_red | high_red).astype(np.uint8) * 255

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    candidate = cv2.morphologyEx(candidate, cv2.MORPH_CLOSE, kernel, iterations=2)
    candidate = cv2.morphologyEx(candidate, cv2.MORPH_OPEN, kernel, iterations=1)

    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(candidate, 8)
    mask = np.zeros_like(candidate)

    for label_id in range(1, num_labels):
        area = int(stats[label_id, cv2.CC_STAT_AREA])
        if area < 8 or area > 3000:
            continue
        box_w = int(stats[label_id, cv2.CC_STAT_WIDTH])
        box_h = int(stats[label_id, cv2.CC_STAT_HEIGHT])
        if box_w > 40 or box_h > 40:
            continue
        # Compactness: the blob should fill most of its bounding box
        # (pupils are near-circular; thin red streaks are rejected).
        if area / (box_w * box_h) < 0.5:
            continue
        mask[labels == label_id] = 255

    if not np.any(mask):
        return _encode_png(bgr)

    # Feather the correction mask so edges blend with the iris.
    blur_kernel = max(3, int(min(box_w, box_h) / 2) | 1)
    feather = cv2.GaussianBlur(mask, (blur_kernel, blur_kernel), 0) if blur_kernel >= 3 else mask
    strength = feather.astype(np.float32) / 255.0 * intensity

    # Desaturate and darken inside the pupil.
    hsv_float = hsv.astype(np.float32)
    hsv_float[:, :, 1] *= 1.0 - 0.9 * strength
    hsv_float[:, :, 2] *= 1.0 - 0.35 * strength
    hsv = np.clip(hsv_float, 0, 255).astype(np.uint8)

    corrected = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    return _encode_png(corrected)


def _encode_png(bgr: np.ndarray) -> bytes:
    ok, buffer = cv2.imencode(".png", bgr)
    if not ok:
        raise ValueError("Unable to encode the corrected image.")
    return buffer.tobytes()