import io, pytest
from PIL import Image
from unittest.mock import patch

def _make_image_bytes():
    img = Image.new("RGB", (200, 250), (100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()

def test_resolve_colour_preset():
    from app.services.bg_remove import _resolve_colour
    assert _resolve_colour("white") == (255, 255, 255, 255)

def test_resolve_colour_hex():
    from app.services.bg_remove import _resolve_colour
    assert _resolve_colour("#ff0000") == (255, 0, 0, 255)

def test_resolve_colour_invalid():
    from app.services.bg_remove import _resolve_colour
    with pytest.raises(ValueError):
        _resolve_colour("neon_rainbow")

def test_dpi_optimizer_output_size():
    from app.services.dpi_optimizer import optimise_dpi
    img_bytes = _make_image_bytes()
    result = optimise_dpi(img_bytes, "35x45")
    img = Image.open(io.BytesIO(result))
    assert img.size == (413, 531)

def test_dpi_optimizer_unknown_preset():
    from app.services.dpi_optimizer import optimise_dpi
    with pytest.raises(ValueError):
        optimise_dpi(_make_image_bytes(), "99x99")

def test_face_center_no_face_falls_back():
    from app.services import face_center as fc
    with patch.object(fc, "_detect_face", return_value=None):
        result = fc.center_face(_make_image_bytes())
        assert isinstance(result, bytes)

def test_error_handler_exists():
    from app.services.errors import ai_error_handler
    assert callable(ai_error_handler)