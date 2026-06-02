"""
sheet_generator.py
Generates a print-ready A4 sheet of passport photos using Pillow.
"""

from __future__ import annotations
import math
from pathlib import Path
from PIL import Image, ImageDraw

# ── Constants ────────────────────────────────────────────────────────────────
DPI       = 300
A4_W_MM   = 210.0
A4_H_MM   = 297.0

MARGIN_MM = 10.0
GUTTER_MM = 3.0

def mm_to_px(mm: float) -> int:
    """Convert millimetres to pixels at 300 DPI."""
    return round(mm / 25.4 * DPI)

A4_W_PX   = mm_to_px(A4_W_MM)
A4_H_PX   = mm_to_px(A4_H_MM)
MARGIN_PX = mm_to_px(MARGIN_MM)
GUTTER_PX = mm_to_px(GUTTER_MM)

# ── Presets ──────────────────────────────────────────────────────────────────
PRESETS = {
    "35x45": {"label": "India/UK Passport", "w": 35,   "h": 45},
    "51x51": {"label": "USA Visa",          "w": 51,   "h": 51},
    "33x48": {"label": "Schengen Visa",     "w": 33,   "h": 48},
    "40x60": {"label": "China Visa",        "w": 40,   "h": 60},
    "2x2in": {"label": "US Passport",       "w": 50.8, "h": 50.8},
    "100x150": {"label": "Postcard Size",   "w": 100,  "h": 150},
    "25x25": {"label": "Stamp Size",        "w": 25,   "h": 25},
    "50x70": {"label": "Canada Passport",   "w": 50,   "h": 70},
    "45x45": {"label": "Japan Passport/Visa", "w": 45, "h": 45},
    "35x50": {"label": "Malaysia Passport", "w": 35,   "h": 50},
}

# ── Main Function ─────────────────────────────────────────────────────────────
def generate_a4_sheet(
    photo_path: str,
    preset_id: str = "35x45",
    quantity: int = 8,
    bg_color: tuple = (255, 255, 255),
    draw_guides: bool = True,
    output_path: str = "sheet.jpg",
) -> str:
    """
    Generate a print-ready A4 sheet of passport photos.

    Args:
        photo_path  : Path to the processed passport photo.
        preset_id   : Size preset e.g. '35x45'.
        quantity    : Number of photo copies on the sheet.
        bg_color    : RGB background colour tuple.
        draw_guides : Whether to draw crop marks.
        output_path : Where to save the output sheet.

    Returns:
        Absolute path to the saved sheet image.
    """
    if preset_id not in PRESETS:
        raise ValueError(f"Unknown preset '{preset_id}'. Choose from: {list(PRESETS)}")

    preset  = PRESETS[preset_id]
    photo_w = mm_to_px(preset["w"])
    photo_h = mm_to_px(preset["h"])

    # Load and resize photo
    photo = _prepare_photo(photo_path, photo_w, photo_h)

    # Calculate grid
    cols, rows = _compute_grid(photo_w, photo_h)
    if cols == 0 or rows == 0:
        raise ValueError("Photo too large to fit on A4 with current margins.")

    # Create A4 canvas
    canvas = Image.new("RGB", (A4_W_PX, A4_H_PX), bg_color)
    draw   = ImageDraw.Draw(canvas) if draw_guides else None

    # Centre the grid on canvas
    grid_w   = cols * photo_w + (cols - 1) * GUTTER_PX
    grid_h   = rows * photo_h + (rows - 1) * GUTTER_PX
    origin_x = (A4_W_PX - grid_w) // 2
    origin_y = (A4_H_PX - grid_h) // 2

    # Paste photos onto canvas
    placed = 0
    for row in range(rows):
        for col in range(cols):
            if placed >= quantity:
                break
            x = origin_x + col * (photo_w + GUTTER_PX)
            y = origin_y + row * (photo_h + GUTTER_PX)
            canvas.paste(photo, (x, y))
            if draw:
                _draw_crop_marks(draw, x, y, photo_w, photo_h)
            placed += 1
        if placed >= quantity:
            break

    # Save output
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path, "JPEG", quality=95, dpi=(DPI, DPI))
    return str(Path(output_path).resolve())


# ── Private Helpers ───────────────────────────────────────────────────────────
def _prepare_photo(photo_path: str, w: int, h: int) -> Image.Image:
    """
    Load photo, flatten alpha channel to white, resize to passport dimensions.

    Args:
        photo_path : Path to the input image.
        w          : Target width in pixels.
        h          : Target height in pixels.

    Returns:
        Resized RGB Pillow Image.
    """
    img = Image.open(photo_path)
    if img.mode in ("RGBA", "LA"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img.convert("RGB"), mask=img.split()[-1])
        img = bg
    else:
        img = img.convert("RGB")
    return img.resize((w, h), Image.LANCZOS)


def _compute_grid(photo_w: int, photo_h: int) -> tuple:
    """
    Calculate columns and rows that fit inside the printable A4 area.

    Args:
        photo_w : Photo width in pixels.
        photo_h : Photo height in pixels.

    Returns:
        Tuple of (cols, rows).
    """
    printable_w = A4_W_PX - 2 * MARGIN_PX
    printable_h = A4_H_PX - 2 * MARGIN_PX
    cols = math.floor((printable_w + GUTTER_PX) / (photo_w + GUTTER_PX))
    rows = math.floor((printable_h + GUTTER_PX) / (photo_h + GUTTER_PX))
    return max(cols, 0), max(rows, 0)


def _draw_crop_marks(
    draw: ImageDraw.ImageDraw,
    x: int, y: int,
    w: int, h: int
) -> None:
    """
    Draw L-shaped crop marks at the four corners of a photo cell.

    Args:
        draw : Pillow ImageDraw instance.
        x    : Top-left x position of the photo.
        y    : Top-left y position of the photo.
        w    : Photo width in pixels.
        h    : Photo height in pixels.
    """
    color    = (180, 180, 180)
    tick_len = mm_to_px(2)
    offset   = GUTTER_PX // 2

    corners = [(x, y), (x + w, y), (x, y + h), (x + w, y + h)]
    for cx, cy in corners:
        hx0 = cx - tick_len if cx == x else cx
        hx1 = cx            if cx == x else cx + tick_len
        sy  = -1 if cy == y else 1
        draw.line([(hx0, cy - sy * offset), (hx1, cy - sy * offset)],
                  fill=color, width=1)

        vy0 = cy - tick_len if cy == y else cy
        vy1 = cy            if cy == y else cy + tick_len
        sx  = -1 if cx == x else 1
        draw.line([(cx - sx * offset, vy0), (cx - sx * offset, vy1)],
                  fill=color, width=1)