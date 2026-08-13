"""
hair_blending.py — Advanced hair strand detection and blending.

Finds flyaway hair strands that stick out into the background of a
portrait photo and blends them back into the surroundings so the
background stays clean (passport-photo ready).

Heuristic strategy (OpenCV only, no ML models)
----------------------------------------------
1. Skin segmentation in YCrCb (Cr/Cb ranges) — hair is anything that is
   clearly not skin and sits in the upper portion of the frame.
2. Morphological cleanup + connected components; candidate strands are
   components that touch the top edge or are thin/elongated
   (height/width ratio or low fill ratio), so faces/skin never regress.
3. A feathered mask (dilated + Gaussian-blurred) drives a confined
   local-average blend that softens the strands into the background.
"""

import io

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


def _hair_candidate_map(bgr: np.ndarray) -> np.ndarray:
    """Binary mask of likely hair strands (upper frame, non-skin)."""
    height = bgr.shape[0]
    ycrcb = cv2.cvtColor(bgr, cv2.COLOR_BGR2YCrCb)
    cr, cb = ycrcb[:, :, 1], ycrcb[:, :, 2]

    skin = (
        (cr >= 133)
        & (cr <= 173)
        & (cb >= 77)
        & (cb <= 127)
        & (cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY) >= 60)
    )
    saturated = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)[:, :, 1] < 60
    dark = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY) < 190

    candidate = (~skin & dark & saturated).astype(np.uint8) * 255
    upper = np.zeros_like(candidate)
    upper[: int(height * 0.45), :] = 255
    candidate = cv2.bitwise_and(candidate, upper)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    candidate = cv2.morphologyEx(candidate, cv2.MORPH_CLOSE, kernel, iterations=2)
    return candidate


def _select_strands(candidate: np.ndarray) -> np.ndarray:
    """Keep small/elongated components (flyaway strands), drop blobs."""
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(candidate, 8)
    mask = np.zeros_like(candidate)
    height = candidate.shape[0]

    for label_id in range(1, num_labels):
        x, y, w, h, area = stats[label_id]
        if area < 12:
            continue
        touches_top = y == 0
        thin_top = touches_top and w <= 8
        elongated = (h / w > 2) or (w / h > 2)
        fill_ratio = area / (w * h)
        # Solid hair masses are dense (fill_ratio near 1) and are not
        # flyaway strands — keep sparse, thin, or top-anchored tufts.
        if (thin_top or touches_top or elongated) and fill_ratio < 0.85:
            mask[labels == label_id] = 255
    # Penalize wide central blobs that fill the frame
    mask[:1, :] = 0
    return mask


def blend_flyaway_hair(image_bytes: bytes, strength: float = 1.0) -> bytes:
    """
    Detect flyaway hair strands and blend them into the background.

    Args:
        image_bytes: Raw bytes of the input image (any OpenCV-decodable format).
        strength:    Blend strength in [0, 1]; 0 disables processing.

    Returns:
        PNG bytes of the processed image.

    Raises:
        ValueError: If the image cannot be decoded.
    """
    bgr = _decode_bgr(image_bytes)
    strength = max(0.0, min(1.0, float(strength)))
    if strength <= 0:
        return _encode_png(bgr)

    strand_mask = _select_strands(_hair_candidate_map(bgr))
    if not np.any(strand_mask):
        return _encode_png(bgr)

    # Dilate + feather so the blend bleeds softly into the strands.
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    dilated = cv2.dilate(strand_mask, kernel, iterations=2)
    feather = cv2.GaussianBlur(dilated.astype(np.float32), (0, 0), 3) / 255.0
    weight = (feather * strength)[:, :, None].astype(np.float32)

    # Confined local-average blend towards the background.
    background = cv2.GaussianBlur(bgr, (0, 0), 7)
    blended = (bgr.astype(np.float32) * (1.0 - weight) +
               background.astype(np.float32) * weight)
    return _encode_png(np.clip(blended, 0, 255).astype(np.uint8))