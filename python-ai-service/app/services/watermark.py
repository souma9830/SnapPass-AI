import io
from PIL import Image, ImageDraw, ImageFont

def apply_watermark(image_bytes: bytes, text: str = "PREVIEW ONLY") -> bytes:
    """
    Overlays a semi-transparent watermark text diagonally across the image.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    
    # Make a blank image for the text, initialized to transparent text color
    txt_layer = Image.new("RGBA", img.size, (255, 255, 255, 0))
    
    try:
        # Try to use a default standard font
        font = ImageFont.truetype("arial.ttf", size=int(img.width / 10))
    except IOError:
        font = ImageFont.load_default()
        
    draw = ImageDraw.Draw(txt_layer)
    
    # Calculate text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    
    x = (img.width - text_w) / 2
    y = (img.height - text_h) / 2
    
    # Draw text with 128 alpha (semi-transparent white)
    draw.text((x, y), text, font=font, fill=(255, 255, 255, 128))
    
    # Rotate the text layer by 45 degrees
    txt_layer = txt_layer.rotate(45, expand=1)
    
    # Paste the rotated text layer onto a new layer of the original image size
    overlay = Image.new("RGBA", img.size, (255, 255, 255, 0))
    px = (img.width - txt_layer.width) // 2
    py = (img.height - txt_layer.height) // 2
    overlay.paste(txt_layer, (px, py))
    
    # Composite the images
    watermarked = Image.alpha_composite(img, overlay).convert("RGB")
    
    output = io.BytesIO()
    watermarked.save(output, format="JPEG", quality=90)
    
    return output.getvalue()
