"""Tests for the watermark preview service (issue #1555)."""

import io
import pytest
from PIL import Image, ImageDraw

from app.services.watermark import apply_watermark, SUPPORTED_POSITIONS


def _make_image(size=(300, 400), colour=(10, 20, 30, 255)):
    image = Image.new("RGBA", size, colour)
    draw = ImageDraw.Draw(image)
    draw.rectangle([40, 60, 260, 340], fill=(200, 200, 200, 255))
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def test_returns_png_of_same_dimensions():
    source = _make_image()
    result = apply_watermark(source, text="SnapPass", opacity=0.18)
    decoded = Image.open(io.BytesIO(result))
    assert decoded.format == "PNG"
    assert decoded.size == (300, 400)


def test_every_supported_position_renders():
    source = _make_image()
    for position in SUPPORTED_POSITIONS:
        result = apply_watermark(source, text="SnapPass", opacity=0.3, position=position)
        assert Image.open(io.BytesIO(result)).size == (300, 400)


def test_empty_text_returns_input_unchanged():
    source = _make_image()
    assert apply_watermark(source, text="   ") == source


def test_opacity_is_clamped():
    source = _make_image()
    result = apply_watermark(source, text="SnapPass", opacity=3.0)
    assert Image.open(io.BytesIO(result)).size == (300, 400)
    result_low = apply_watermark(source, text="SnapPass", opacity=-1.0)
    assert Image.open(io.BytesIO(result_low)).size == (300, 400)


def test_invalid_position_raises():
    with pytest.raises(ValueError):
        apply_watermark(_make_image(), text="SnapPass", position="top-left")


def test_garbage_bytes_raise_value_error():
    with pytest.raises(ValueError):
        apply_watermark(b"not-an-image")


def test_non_default_text_applied():
    source = _make_image()
    result = apply_watermark(source, text="PREVIEW ONLY", opacity=0.25)
    assert result != source