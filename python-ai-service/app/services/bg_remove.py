"""
bg_remove.py — Background removal and colour composition.

Uses rembg to strip the background from a portrait photo, then composites
the foreground onto a solid-colour backing in the requested colour.

Supported colour identifiers
-----------------------------
Named colours are matched case-insensitively.  A hex string (#rrggbb or
#rgb) is also accepted for custom colour picker values forwarded from the
frontend.

Keep this list in sync with frontend/src/data/backgroundColours.js.
"""

from rembg import remove
from PIL import Image
import io
from app.services.attire_swap import apply_attire_swap


# Named colour presets — (R, G, B, A) tuples where A is always 255.
# Ordered to match the frontend registry for easier cross-reference.
SUPPORTED_COLOURS: dict[str, tuple[int, int, int, int]] = {
    "white":       (255, 255, 255, 255),
    "off-white":   (245, 240, 232, 255),  # warm off-white, Australia/NZ standard
    "blue":        (67,  114, 196, 255),  # US visa / China standard blue
    "light-blue":  (207, 226, 255, 255),  # Canada / Schengen soft blue
    "grey":        (200, 200, 200, 255),
    "gray":        (200, 200, 200, 255),  # alias
    "light-grey":  (220, 220, 220, 255),
    "light-gray":  (220, 220, 220, 255),  # alias
    "red":         (229,  57,  53, 255),  # Malaysia NRIC red
}


def remove_background(
        image_bytes: bytes,
        background_colour: str = "white",
        attire: str = "none") -> bytes:
    """
    Strip the photo background and composite onto the requested colour.

    Args:
        image_bytes:       Raw bytes of the input image.
        background_colour: Named colour id or hex string (e.g. '#4372c4').
        attire:            Optional attire overlay id ('none' to skip).

    Returns:
        PNG bytes of the composited result.

    Raises:
        ValueError: If background_colour is not a recognised name or valid hex.
    """
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


def _resolve_colour(colour: str) -> tuple[int, int, int, int]:
    """Return an RGBA tuple for a named colour key or a hex string.

    Args:
        colour: Named preset identifier or CSS hex string (#rrggbb / #rgb).

    Returns:
        (R, G, B, A) tuple where A = 255.

    Raises:
        ValueError: Unrecognised colour identifier or malformed hex string.
    """
    normalised = colour.strip().lower()

    if normalised in SUPPORTED_COLOURS:
        return SUPPORTED_COLOURS[normalised]

    if normalised.startswith("#"):
        return _hex_to_rgba(normalised)

    raise ValueError(
        f"Unsupported background colour '{colour}'. "
        f"Use one of {list(SUPPORTED_COLOURS.keys())} "
        f"or a hex string like '#4372c4'."
    )


def _hex_to_rgba(hex_colour: str) -> tuple[int, int, int, int]:
    """Convert a CSS hex colour string to an RGBA tuple.

    Accepts #rrggbb (6-digit) and #rgb (3-digit) shorthand formats.

    Args:
        hex_colour: Hex string including the leading '#'.

    Returns:
        (R, G, B, 255) tuple.

    Raises:
        ValueError: If the hex string is malformed.
    """
    h = hex_colour.lstrip("#")
    # Expand 3-digit shorthand to 6-digit form
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        raise ValueError(
            f"Invalid hex colour '{hex_colour}'. "
            "Expected #rrggbb (6 hex digits) or #rgb (3 hex digits)."
        )
    try:
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    except ValueError:
        raise ValueError(f"Malformed hex colour '{hex_colour}': non-hex characters detected.")
    return (r, g, b, 255)
