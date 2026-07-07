from __future__ import annotations
import math
from pathlib import Path
from PIL import Image, ImageDraw

DPI = 300

PAGE_SIZES = {
    "a4": {"w_mm": 210.0, "h_mm": 297.0, "label": "A4"},
    "letter": {"w_mm": 215.9, "h_mm": 279.4, "label": "US Letter"},
    "4x6": {"w_mm": 101.6, "h_mm": 152.4, "label": "4×6"},
}

MARGIN_MM = 10.0
GUTTER_MM = 3.0

PRESETS = {
    "35x45": {"label": "India/UK Passport", "w": 35, "h": 45},
    "51x51": {"label": "USA Visa", "w": 51, "h": 51},
    "33x48": {"label": "Schengen Visa", "w": 33, "h": 48},
    "40x60": {"label": "China Visa", "w": 40, "h": 60},
    "2x2in": {"label": "US Passport", "w": 50.8, "h": 50.8},
    "100x150": {"label": "Postcard Size", "w": 100, "h": 150},
    "25x25": {"label": "Stamp Size", "w": 25, "h": 25},
    "50x70": {"label": "Canada Passport", "w": 50, "h": 70},
    "45x45": {"label": "Japan Passport/Visa", "w": 45, "h": 45},
    "35x50": {"label": "Malaysia Passport", "w": 35, "h": 50},
}


def mm_to_px(mm: float) -> int:
    return round(mm / 25.4 * DPI)


def generate_sheet(
    photo_path: str,
    preset_id: str = "35x45",
    quantity: int = 8,
    page_size: str = "a4",
    bg_color: tuple = (255, 255, 255),
    draw_guides: bool = True,
    output_path: str = "sheet.jpg",
) -> str:
    if preset_id not in PRESETS:
        raise ValueError(f"Unknown preset '{preset_id}'. Choose from: {list(PRESETS)}")

    if page_size not in PAGE_SIZES:
        raise ValueError(f"Unknown page size '{page_size}'. Choose from: {list(PAGE_SIZES)}")

    preset = PRESETS[preset_id]
    page = PAGE_SIZES[page_size]

    page_w_px = mm_to_px(page["w_mm"])
    page_h_px = mm_to_px(page["h_mm"])
    margin_px = mm_to_px(MARGIN_MM)
    gutter_px = mm_to_px(GUTTER_MM)

    photo_w = mm_to_px(preset["w"])
    photo_h = mm_to_px(preset["h"])

    photo = _prepare_photo(photo_path, photo_w, photo_h)
    cols, rows = _compute_grid(photo_w, photo_h, page_w_px, page_h_px, margin_px, gutter_px)

    if cols == 0 or rows == 0:
        raise ValueError("Photo too large to fit on selected page size.")

    canvas = Image.new("RGB", (page_w_px, page_h_px), bg_color)
    draw = ImageDraw.Draw(canvas) if draw_guides else None

    grid_w = cols * photo_w + (cols - 1) * gutter_px
    grid_h = rows * photo_h + (rows - 1) * gutter_px
    origin_x = (page_w_px - grid_w) // 2
    origin_y = (page_h_px - grid_h) // 2

    placed = 0
    for row in range(rows):
        for col in range(cols):
            if placed >= quantity:
                break
            x = origin_x + col * (photo_w + gutter_px)
            y = origin_y + row * (photo_h + gutter_px)
            canvas.paste(photo, (x, y))
            if draw:
                _draw_crop_marks(draw, x, y, photo_w, photo_h, tick_len_px=gutter_px // 2, color=(180, 180, 180))
            placed += 1
        if placed >= quantity:
            break

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path, "JPEG", quality=95, dpi=(DPI, DPI))
    return str(Path(output_path).resolve())


def _prepare_photo(photo_path: str, w: int, h: int) -> Image.Image:
    img = Image.open(photo_path)
    if img.mode in ("RGBA", "LA"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img.convert("RGB"), mask=img.split()[-1])
        img = bg
    else:
        img = img.convert("RGB")
    return img.resize((w, h), Image.LANCZOS)


def _compute_grid(photo_w: int, photo_h: int, page_w: int, page_h: int, margin: int, gutter: int) -> tuple:
    printable_w = page_w - 2 * margin
    printable_h = page_h - 2 * margin
    cols = math.floor((printable_w + gutter) / (photo_w + gutter))
    rows = math.floor((printable_h + gutter) / (photo_h + gutter))
    return max(cols, 0), max(rows, 0)


def _draw_crop_marks(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, tick_len_px: int, color: tuple) -> None:
    tick_len = tick_len_px
    offset = tick_len // 2
    corners = [(x, y), (x + w, y), (x, y + h), (x + w, y + h)]
    for cx, cy in corners:
        hx0 = cx - tick_len if cx == x else cx
        hx1 = cx if cx == x else cx + tick_len
        sy = -1 if cy == y else 1
        draw.line([(hx0, cy - sy * offset), (hx1, cy - sy * offset)], fill=color, width=1)
        vy0 = cy - tick_len if cy == y else cy
        vy1 = cy if cy == y else cy + tick_len
        sx = -1 if cx == x else 1
        draw.line([(cx - sx * offset, vy0), (cx - sx * offset, vy1)], fill=color, width=1)
