"""
test_bg_remove.py — Unit tests for rembg background removal and color composition.
"""

import pytest
import numpy as np
from PIL import Image
import io
from app.services.bg_remove import _resolve_colour, _hex_to_rgba, SUPPORTED_COLOURS


def test_supported_named_colours():
    """Verify supported named background colours return expected RGBA tuples."""
    assert _resolve_colour("white") == (255, 255, 255, 255)
    assert _resolve_colour("blue") == (67, 114, 196, 255)
    assert _resolve_colour("red") == (229, 57, 53, 255)


def test_hex_colour_resolution():
    """Verify 6-digit and 3-digit hex strings resolve to valid RGBA tuples."""
    assert _resolve_colour("#ffffff") == (255, 255, 255, 255)
    assert _resolve_colour("#4372c4") == (67, 114, 196, 255)
    assert _resolve_colour("#fff") == (255, 255, 255, 255)


def test_unsupported_colour_raises_value_error():
    """Verify invalid colour names or hex strings raise ValueError."""
    with pytest.raises(ValueError, match="Unsupported background colour"):
        _resolve_colour("invalid_colour_name")

    with pytest.raises(ValueError, match="Invalid hex colour"):
        _resolve_colour("#invalidhex")
