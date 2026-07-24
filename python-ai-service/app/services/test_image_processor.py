import pytest
import io
from PIL import Image
from dpi_optimizer import optimise_dpi, get_preset_dimensions, list_presets, PRESETS
from sheet_generator import generate_sheet


def test_get_preset_dimensions_valid():
    dimensions = get_preset_dimensions("35x45")
    assert dimensions["preset"] == "35x45"
    assert dimensions["width_mm"] == 35
    assert dimensions["height_mm"] == 45
    assert dimensions["dpi"] == 300
    assert "width_px" in dimensions
    assert "height_px" in dimensions


def test_get_preset_dimensions_invalid():
    with pytest.raises(ValueError):
        get_preset_dimensions("invalid_preset")


def test_list_presets():
    presets = list_presets()
    assert len(presets) == len(PRESETS)
    assert any(p["preset"] == "51x51" for p in presets)


def test_optimise_dpi():
    # Create a small dummy image in memory
    img = Image.new("RGB", (100, 100), color="red")
    img_bytes_io = io.BytesIO()
    img.save(img_bytes_io, format="PNG")
    img_bytes = img_bytes_io.getvalue()

    # Run optimizer
    output_bytes = optimise_dpi(img_bytes, "35x45")

    # Verify resulting image properties
    output_img = Image.open(io.BytesIO(output_bytes))
    assert output_img.format == "PNG"
    dpi = output_img.info.get("dpi")
    assert dpi == pytest.approx((300, 300), rel=1e-3)


def test_optimise_dpi_invalid_preset():
    img = Image.new("RGB", (100, 100), color="blue")
    img_bytes_io = io.BytesIO()
    img.save(img_bytes_io, format="PNG")
    img_bytes = img_bytes_io.getvalue()

    with pytest.raises(ValueError):
        optimise_dpi(img_bytes, "invalid_preset")


def test_generate_sheet_empty_photo_paths():
    with pytest.raises(ValueError, match="photo_paths list cannot be empty"):
        generate_sheet([], preset_id="35x45", quantity=8)
