import cv2
from pathlib import Path

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
ALLOWED_MAGIC_BYTES = {
    b'\xff\xd8\xff': 'jpeg',   # JPEG
    b'\x89PNG': 'png',          # PNG
}


def detect_image_type(file_path: str) -> str | None:
    with open(file_path, 'rb') as f:
        header = f.read(12)
    for magic, img_type in ALLOWED_MAGIC_BYTES.items():
        if header.startswith(magic):
            return img_type
    # WebP is a RIFF container: verify BOTH the 'RIFF' signature
    # (bytes 0-3) and the 'WEBP' format header (bytes 8-11). Otherwise
    # any RIFF file (e.g. WAV audio, AVI video) would be misdetected.
    if header.startswith(b'RIFF') and header[8:12] == b'WEBP':
        return 'webp'
    return None


def validate_image_bytes(file_path: str) -> bool:
    # 1. Extension check
    ext = Path(file_path).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Rejected: file extension '{ext}' not allowed.")

    # 2. Magic byte check (actual file content)
    img_type = detect_image_type(file_path)
    if img_type is None:
        raise ValueError(
            f"Rejected: file does not match any allowed image format (JPEG, PNG, WebP).")

    # 3. OpenCV decode check
    img = cv2.imread(file_path)
    if img is None:
        raise ValueError(
            "Rejected: file could not be decoded as a valid image by OpenCV.")

    return True
