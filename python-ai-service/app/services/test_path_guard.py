"""Tests for path_guard module."""
import pytest
from app.services.path_guard import safe_photo_path, validate_magic_bytes


class TestSafePhotoPath:
    def test_valid_filename_passes(self, tmp_path, monkeypatch):
        import app.config as config
        monkeypatch.setattr(config, "UPLOAD_DIR", str(tmp_path))
        result = safe_photo_path("test.jpg")
        assert result.endswith("test.jpg")

    def test_traversal_rejected(self, tmp_path, monkeypatch):
        import app.config as config
        monkeypatch.setattr(config, "UPLOAD_DIR", str(tmp_path))
        with pytest.raises(ValueError, match="outside the allowed"):
            safe_photo_path("../../etc/passwd")

    def test_empty_string_rejected(self, tmp_path, monkeypatch):
        import app.config as config
        monkeypatch.setattr(config, "UPLOAD_DIR", str(tmp_path))
        with pytest.raises(ValueError, match="non-empty string"):
            safe_photo_path("")


class TestValidateMagicBytes:
    def test_jpeg_detected(self, tmp_path):
        jpeg_header = b"\xff\xd8\xff\xe0" + b"\x00" * 8
        f = tmp_path / "test.jpg"
        f.write_bytes(jpeg_header)
        assert validate_magic_bytes(str(f)) == "jpeg"

    def test_png_detected(self, tmp_path):
        png_header = b"\x89PNG\r\n\x1a\n" + b"\x00" * 8
        f = tmp_path / "test.png"
        f.write_bytes(png_header)
        assert validate_magic_bytes(str(f)) == "png"

    def test_unsupported_raises(self, tmp_path):
        f = tmp_path / "test.txt"
        f.write_bytes(b"not an image")
        with pytest.raises(ValueError, match="Unsupported or corrupted"):
            validate_magic_bytes(str(f))