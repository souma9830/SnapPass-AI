"""
test_exif_sanitizer.py — Test cases for EXIF stripper
Built for ELUSoC 2026 / GSSOC 2026.
"""
from PIL import Image
import io
from app.services.exif_sanitizer import strip_exif_metadata

def test_strip_exif():
    img = Image.new('RGB', (100, 100), color='red')
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    raw_bytes = buf.getvalue()

    cleaned_bytes = strip_exif_metadata(raw_bytes)
    cleaned_img = Image.open(io.BytesIO(cleaned_bytes))
    
    assert len(cleaned_img.getexif()) == 0
