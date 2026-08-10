import io
from PIL import Image
from app.services.lighting_analyzer import analyze_facial_lighting

def test_analyze_facial_lighting_empty():
    result = analyze_facial_lighting(b"")
    assert result["score"] == 0.0
    assert result["has_glare"] is False

def test_analyze_facial_lighting_synthetic_image():
    # Create 100x100 RGB image
    img = Image.new("RGB", (100, 100), color=(180, 180, 180))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    image_bytes = buf.getvalue()

    result = analyze_facial_lighting(image_bytes)
    assert result["score"] >= 80.0
    assert result["symmetry_percentage"] >= 95.0
    assert result["has_glare"] is False
    assert result["has_heavy_shadows"] is False
    assert "left_luminance" in result
    assert "right_luminance" in result
    assert "specular_highlight_ratio" in result
    assert "vertical_shadow_gradient" in result
