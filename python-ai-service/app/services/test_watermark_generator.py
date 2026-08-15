"""
test_watermark_generator.py — Watermark Generator Tests
Built for ELUSoC 2026 / GSSOC 2026.
"""
from PIL import Image
import io
from app.services.watermark_generator import apply_anti_tamper_watermark

def test_apply_watermark():
    img = Image.new('RGB', (100, 100), color='white')
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    res = apply_anti_tamper_watermark(buf.getvalue())
    assert res is not None
