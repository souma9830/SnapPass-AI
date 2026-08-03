import os
import tempfile

from app.services.face_validator import detect_image_type


def _write_bytes(data: bytes) -> str:
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(data)
        return tmp.name


def _cleanup(path: str) -> None:
    if os.path.exists(path):
        os.remove(path)


def test_detects_jpeg_magic_bytes():
    path = _write_bytes(b"\xff\xd8\xff\xe0\x00\x10JFIF")
    try:
        assert detect_image_type(path) == "jpeg"
    finally:
        _cleanup(path)


def test_detects_png_magic_bytes():
    path = _write_bytes(b"\x89PNG\r\n\x1a\n\x00\x00")
    try:
        assert detect_image_type(path) == "png"
    finally:
        _cleanup(path)


def test_detects_webp_only_with_both_riff_and_webp_headers():
    path = _write_bytes(b"RIFF\x0a\x00\x00\x00WEBPVP8 ")
    try:
        assert detect_image_type(path) == "webp"
    finally:
        _cleanup(path)


def test_does_not_misdetect_wav_audio_as_webp():
    path = _write_bytes(b"RIFF\x24\x00\x00\x00WAVEfmt ")
    try:
        assert detect_image_type(path) is None
    finally:
        _cleanup(path)


def test_does_not_misdetect_avi_video_as_webp():
    path = _write_bytes(b"RIFF\x24\x00\x00\x00AVI LIST")
    try:
        assert detect_image_type(path) is None
    finally:
        _cleanup(path)


def test_rejects_unknown_magic_bytes():
    path = _write_bytes(b"GARBAGE_NOT_AN_IMAGE")
    try:
        assert detect_image_type(path) is None
    finally:
        _cleanup(path)
