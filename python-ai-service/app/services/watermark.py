"""
watermark.py — Watermarking for preview images.

Overlays a semi-transparent text watermark on an image before it is
returned to the client, so watermarked previews discourage the reuse of
low-quality downloads while the paid/print pipeline stays clean.

Supported placements:

- bottom-right  (default): small, unobtrusive corner mark
- center        : diagonal-ish centered mark for strong visibility
- tiled         : repeating diagonal grid across the whole image
"""

from PIL import Image, ImageDraw, ImageFont
import io
import os

WATERMARK_DEFAULT_TEXT = "SnapPass"
DEFAULT_OPACITY = 0.18
SUPPORTED_POSITIONS = ("bottom-right", "center", "tiled")

_FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "C:/Windows/Fonts/arialbd.ttf",
]


def _load_font(pixel_size: int):
    """Best-effort truetype font load, falling back to the bitmap default."""
    for candidate in _FONT_CANDIDATES:
        if os.path.exists(candidate):
            try:
                return ImageFont.truetype(candidate, size=pixel_size)
            except OSError:
                continue
    try:
        return ImageFont.load_default(size=pixel_size)
    except TypeError:
        return ImageFont.load_default()


def _text_rgba(text: str, opacity: float, font) -> tuple:
    """Render the watermark text as an RGBA image."""
    temp = Image.new("RGBA", (10, 10), (0, 0, 0, 0))
    draw = ImageDraw.Draw(temp)
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    width, height = right - left, bottom - top
    alpha = max(0, min(255, round(opacity * 255)))
    canvas = Image.new("RGBA", (width + 8, height + 8), (0, 0, 0, 0))
    layer = Image.new("RGBA", canvas.size, (255, 255, 255, alpha))
    draw = ImageDraw.Draw(layer)
    draw.text((4 - left, 4 - top), text, font=font, fill=(255, 255, 255, alpha))
    return layer


def apply_watermark(
        image_bytes: bytes,
        text: str = WATERMARK_DEFAULT_TEXT,
        opacity: float = DEFAULT_OPACITY,
        position: str = "bottom-right") -> bytes:
    """
    Overlay a semi-transparent watermark and return PNG bytes.

    Args:
        image_bytes: Raw bytes of the input image.
        text:        Watermark text (empty string disables watermarking).
        opacity:     Transparency factor in [0, 1] (1 = fully opaque).
        position:    One of "bottom-right", "center", "tiled".

    Returns:
        PNG bytes of the watermarked image.

    Raises:
        ValueError: If the image cannot be decoded or position is invalid.
    """
    if not text.strip():
        return image_bytes

    if position not in SUPPORTED_POSITIONS:
        raise ValueError(
            f"Unsupported watermark position '{position}'. "
            f"Use one of {list(SUPPORTED_POSITIONS)}."
        )

    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.load()
    except Exception as exc:
        raise ValueError("Unable to decode the uploaded image.") from exc

    base = image.convert("RGBA")
    width, height = base.size

    opacity = max(0.0, min(1.0, float(opacity)))
    font = _load_font(pixel_size=max(16, width // 16))
    layer = _text_rgba(text, opacity, font)

    if position == "tiled":
        watermark = Image.new("RGBA", (layer.width * 2, layer.height), (0, 0, 0, 0))
        for offset in (0, layer.width):
            watermark.paste(layer, (offset, 0), layer)
        step_x, step_y = watermark.width // 2, watermark.height // 2
        for y in range(-step_y, height, watermark.height):
            for x in range(-step_x, width, watermark.width):
                base.alpha_composite(watermark, (x, y))
    elif position == "center":
        base.alpha_composite(
            layer,
            ((width - layer.width) // 2, (height - layer.height) // 2),
        )
    else:  # bottom-right
        margin = max(12, width // 30)
        base.alpha_composite(
            layer,
            (width - layer.width - margin, height - layer.height - margin),
        )

    output = io.BytesIO()
    base.convert("RGB").save(output, format="PNG")
    return output.getvalue()