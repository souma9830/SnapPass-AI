"""Tests for the hair blending service (#1559)."""

import cv2
import numpy as np
import pytest

from app.services.hair_blending import (
    _hair_candidate_map,
    _select_strands,
    blend_flyaway_hair,
)


def _synthetic_portrait(with_strand: bool = True) -> bytes:
    """White background, dark blob centered (head) + optional thin strand.

    The stand-in "strand" is a thin diagonal line running from the top
    edge of the frame into the background — exactly the shape the
    connected-component heuristic should catch.
    """
    canvas = np.full((200, 200, 3), 245, dtype=np.uint8)
    cv2.circle(canvas, (100, 150), 40, (60, 60, 70), -1)
    if with_strand:
        for i in range(6):
            cv2.line(canvas, (92 + i * 3, 0), (96 + i * 3, 44), (45, 47, 55), 1)
    return cv2.imencode(".png", canvas)[1].tobytes()


def test_candidate_map_finds_upper_hair_region():
    bgr = cv2.imdecode(np.frombuffer(_synthetic_portrait(), np.uint8), cv2.IMREAD_COLOR)
    candidate = _hair_candidate_map(bgr)
    # The strand near the top must be marked.
    assert candidate[:30, 95:115].sum() > 0


def test_select_strands_keeps_elongated_touching_top():
    bgr = cv2.imdecode(np.frombuffer(_synthetic_portrait(), np.uint8), cv2.IMREAD_COLOR)
    strands = _select_strands(_hair_candidate_map(bgr))
    assert strands[:40].sum() > 0


def test_blend_changes_strand_pixels_only():
    plain = _synthetic_portrait(with_strand=False)
    with_strand = _synthetic_portrait(with_strand=True)

    result = blend_flyaway_hair(with_strand, strength=1.0)
    out = cv2.imdecode(np.frombuffer(result, np.uint8), cv2.IMREAD_COLOR)
    diff = np.abs(out.astype(int) - cv2.imdecode(
        np.frombuffer(with_strand, np.uint8), cv2.IMREAD_COLOR).astype(int)).sum()

    # Control image (no strand) is never modified.
    assert blend_flyaway_hair(plain, strength=1.0) == plain
    assert diff > 0


def test_zero_strength_passthrough():
    source = _synthetic_portrait()
    assert blend_flyaway_hair(source, strength=0.0) == source


def test_strength_clamped():
    source = _synthetic_portrait()
    out = cv2.imdecode(
        np.frombuffer(blend_flyaway_hair(source, strength=99.0), np.uint8),
        cv2.IMREAD_COLOR,
    )
    assert out.shape == (200, 200, 3)


def test_invalid_bytes_raise():
    with pytest.raises(ValueError):
        blend_flyaway_hair(b"not-an-image", strength=1.0)


def test_output_is_png():
    result = blend_flyaway_hair(_synthetic_portrait())
    assert result[:8] == b"\x89PNG\r\n\x1a\n"