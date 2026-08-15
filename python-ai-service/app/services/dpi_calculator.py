"""
dpi_calculator.py — High-DPI Print Dimension Converter
Built for ELUSoC 2026 / GSSOC 2026.
"""
MM_PER_INCH = 25.4

def mm_to_pixels(mm_val: float, dpi: int = 300) -> int:
    return int(round((mm_val / MM_PER_INCH) * dpi))

def pixels_to_mm(px_val: int, dpi: int = 300) -> float:
    return round((px_val / float(dpi)) * MM_PER_INCH, 2)
