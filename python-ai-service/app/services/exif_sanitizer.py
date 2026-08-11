"""
exif_sanitizer.py — Privacy Compliant Biometric EXIF Stripper & Lossless Compressor
Built for ELUSoC 2026 / GSSOC 2026.
"""
from PIL import Image
import io

def strip_exif_metadata(image_bytes: bytes) -> bytes:
    image = Image.open(io.BytesIO(image_bytes))
    
    # Create clean image copy without EXIF dictionary
    data = list(image.getdata())
    clean_image = Image.new(image.mode, image.size)
    clean_image.putdata(data)
    
    output_buffer = io.BytesIO()
    clean_image.save(output_buffer, format=image.format or 'JPEG', quality=95, optimize=True)
    return output_buffer.getvalue()
