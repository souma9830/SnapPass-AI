"""
crop_mark_renderer.py — Crop Mark Alignment Utility for Print Sheets
Built for ELUSoC 2026 / GSSOC 2026.
"""
from PIL import ImageDraw

def draw_crop_marks(draw: ImageDraw.ImageDraw, x: int, y: int, width: int, height: int, mark_length: int = 15):
    # Top-left corner marks
    draw.line([(x - mark_length, y), (x, y)], fill='black', width=2)
    draw.line([(x, y - mark_length), (x, y)], fill='black', width=2)

    # Top-right corner marks
    draw.line([(x + width, y), (x + width + mark_length, y)], fill='black', width=2)
    draw.line([(x + width, y - mark_length), (x + width, y)], fill='black', width=2)
