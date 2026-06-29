from rembg import remove
from PIL import Image
import io
from app.services.attire_swap import apply_attire_swap


SUPPORTED_COLOURS = {
    "white": (255, 255, 255, 255),
    "off-white": (245, 245, 245, 255),
    "blue": (67, 114, 196, 255),
    "grey": (200, 200, 200, 255),
    "gray": (200, 200, 200, 255),
}


def remove_background(
        image_bytes: bytes,
        background_colour: str = "white",
        attire: str = "none") -> bytes:

    removed_bytes = remove(image_bytes)
    foreground = Image.open(io.BytesIO(removed_bytes)).convert("RGBA")
    
    if attire != "none":
        foreground = apply_attire_swap(foreground, attire)
        
    bg_rgba = _resolve_colour(background_colour)

    background = Image.new("RGBA", foreground.size, bg_rgba)
    composite = Image.alpha_composite(background, foreground)

    result = composite.convert("RGB")
    output = io.BytesIO()
    result.save(output, format="PNG")
    return output.getvalue()


def _resolve_colour(colour: str) -> tuple:
    """Return an RGBA tuple for a named colour or hex string."""
    normalised = colour.strip().lower()

    if normalised in SUPPORTED_COLOURS:
        return SUPPORTED_COLOURS[normalised]

    if normalised.startswith("#"):
        return _hex_to_rgba(normalised)

    raise ValueError(
        f"Unsupported background colour '{colour}'. Use one of {list(SUPPORTED_COLOURS.keys())} or a hex string like '#ffffff'.")


def _hex_to_rgba(hex_colour: str) -> tuple:
    """Convert a hex colour string (#rrggbb or #rgb) to an RGBA tuple."""
    h = hex_colour.lstrip("#")
    # some hex code has length of three below written code is converting into
    # a length of 6
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        raise ValueError(f"Invalid hex colour: '{hex_colour}'")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return (r, g, b, 255)
