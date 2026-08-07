"""
path_guard.py — Shared path safety and magic-byte validation for the Python AI service.

All endpoints that accept a file_path from client request bodies must validate
the path through this module before touching the filesystem.
"""

import pathlib
from app.config import UPLOAD_DIR


def safe_photo_path(raw: str) -> str:
    """Resolve raw to an absolute path inside UPLOAD_DIR.

    Strips directory traversal by taking only the filename component, then
    resolves and boundary-checks against UPLOAD_DIR using pathlib.Path.relative_to().

    Args:
        raw: The photo_path value received from the request body.

    Returns:
        The resolved absolute path string if it is within UPLOAD_DIR.

    Raises:
        ValueError: If the resolved path is outside UPLOAD_DIR or raw is empty.
    """
    if not raw or not isinstance(raw, str):
        raise ValueError("file_path must be a non-empty string.")
    allowed_dir = pathlib.Path(UPLOAD_DIR).resolve()
    resolved = (allowed_dir / pathlib.Path(raw).name).resolve()
    try:
        resolved.relative_to(allowed_dir)
    except ValueError:
        raise ValueError(
            "Invalid file_path: path is outside the allowed upload directory."
        )
    return str(resolved)


MAGIC_BYTES = {
    "jpeg": b"\xff\xd8\xff",
    "png": b"\x89PNG",
    "webp": b"RIFF",
}


def validate_magic_bytes(file_path: str) -> str:
    """Read the first bytes of a file and return the detected image type.

    Args:
        file_path: Absolute path to the image file.

    Returns:
        One of 'jpeg', 'png', 'webp'.

    Raises:
        ValueError: If the file cannot be read or its magic bytes are unrecognised.
    """
    try:
        with open(file_path, "rb") as f:
            header = f.read(12)
    except OSError as exc:
        raise ValueError(f"Cannot read file: {exc}") from exc

    if header.startswith(MAGIC_BYTES["jpeg"]):
        return "jpeg"
    if header.startswith(MAGIC_BYTES["png"]):
        return "png"
    if header.startswith(MAGIC_BYTES["webp"]) and b"WEBP" in header[8:12]:
        return "webp"

    raise ValueError(
        "Unsupported or corrupted image file. Expected JPEG, PNG, or WEBP."
    )