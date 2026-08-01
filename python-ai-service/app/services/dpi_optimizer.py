from PIL import Image, ImageDraw
import io


TARGET_DPI = 300  # standard for print-quality passport photos

# Preset: (width_mm, height_mm)
PRESETS = {
    "35x45": (35, 45),    # India/UK passport
    "51x51": (51, 51),    # USA visa
    "33x48": (33, 48),    # Schengen visa
    "40x60": (40, 60),    # China visa
    "2x2in": (50.8, 50.8),  # US passport(2 × 2 inches)
}

# Digital-use presets: direct pixel dimensions, no physical size.
# Preset: (width_px, height_px, shape)
DIGITAL_PRESETS = {
    "linkedin-400": (400, 400, "square"),
    "slack-512": (512, 512, "circle"),
    "github-460": (460, 460, "square"),
    "teams-400": (400, 400, "circle"),
}


def optimise_dpi(image_bytes: bytes, preset: str = "35x45") -> bytes:
    """
    Resize image_bytes to the pixel dimensions defined by preset at TARGET_DPI,
    then embed DPI metadata.
    Args:
        image_bytes: PNG bytes of the face-centred photo.
        preset:      Key from PRESETS (e.g. "35x45"). Defaults to "35x45".
    Returns:
        High-resolution PNG bytes ready for printing or sheet tiling.
    Raises:
        ValueError: If preset is not recognised.
    """
    if preset in DIGITAL_PRESETS:
        return _optimise_digital(image_bytes, preset)

    if preset not in PRESETS:
        raise ValueError(
            f"Unknown preset '{preset}'. "
            f"Available presets: {list(PRESETS.keys())}"
        )

    width_mm, height_mm = PRESETS[preset]
    target_px_w, target_px_h = _mm_to_px(width_mm), _mm_to_px(height_mm)

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Use LANCZOS for high-quality downscaling / upscaling
    resized = img.resize((target_px_w, target_px_h), Image.LANCZOS)
    output = io.BytesIO()
    resized.save(output, format="PNG", dpi=(TARGET_DPI, TARGET_DPI))
    return output.getvalue()


def _optimise_digital(image_bytes: bytes, preset: str) -> bytes:
    """Resize to the exact pixel dimensions of a digital-use preset.

    Circular presets (e.g. Slack, Teams avatars) are cropped to a circle
    centered on the square canvas, so the exported file is ready to upload.
    """
    width_px, height_px, shape = DIGITAL_PRESETS[preset]
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    resized = img.resize((width_px, height_px), Image.LANCZOS)

    if shape == "circle":
        mask = Image.new("L", (width_px, height_px), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, width_px, height_px), fill=255)
        resized.putalpha(mask)

    output = io.BytesIO()
    resized.save(output, format="PNG")
    return output.getvalue()


def get_preset_dimensions(preset: str) -> dict:
    """
    Return width, height in mm and px for a given preset.
    Useful for the /presets API endpoint.
    """
    if preset in DIGITAL_PRESETS:
        w_px, h_px, shape = DIGITAL_PRESETS[preset]
        return {
            "preset": preset,
            "category": "digital",
            "width_px": w_px,
            "height_px": h_px,
            "shape": shape,
        }
    if preset not in PRESETS:
        raise ValueError(f"Unknown preset '{preset}'.")
    w_mm, h_mm = PRESETS[preset]
    return {
        "preset": preset,
        "width_mm": w_mm,
        "height_mm": h_mm,
        "width_px": _mm_to_px(w_mm),
        "height_px": _mm_to_px(h_mm),
        "dpi": TARGET_DPI,
    }


def list_presets() -> list:
    """Return all presets as a list of dimension dicts."""
    presets = [get_preset_dimensions(p) for p in PRESETS]
    presets.extend(get_preset_dimensions(p) for p in DIGITAL_PRESETS)
    return presets


# Helpers
def _mm_to_px(mm: float) -> int:
    """Convert millimetres to pixels at TARGET_DPI."""
    return round(mm / 25.4 * TARGET_DPI)
