"""
watermark_generator.py — Anti-Tamper Translucent Watermark Overlay Generator
Built for ELUSoC 2026 / GSSOC 2026.
"""
from PIL import Image, ImageDraw, ImageFont
import io

def apply_anti_tamper_watermark(image_bytes: bytes, text: str = "SAMPLE PREVIEW") -> bytes:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    txt_layer = Image.new("RGBA", image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(txt_layer)
    draw.text((20, 20), text, fill=(255, 255, 255, 128))
    watermarked = Image.alpha_composite(image, txt_layer)
    
    buf = io.BytesIO()
    watermarked.convert("RGB").save(buf, format="JPEG")
    return buf.getvalue()
