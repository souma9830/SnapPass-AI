import pytest
from PIL import Image

from app.services.face_validator import check_image_resolution


def test_accepts_normal_size_image(tmp_path):
    img_path = tmp_path / "small.png"
    Image.new("RGB", (400, 300)).save(img_path)
    check_image_resolution(str(img_path))


def test_rejects_image_with_both_dimensions_over_limit(monkeypatch, tmp_path):
    class FakeImage:
        size = (10000, 10000)

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    monkeypatch.setattr("PIL.Image.open", lambda path: FakeImage())
    path = tmp_path / "huge.png"
    path.write_bytes(b"fake")
    with pytest.raises(ValueError, match="exceeds maximum"):
        check_image_resolution(str(path))


def test_rejects_image_wider_than_limit(monkeypatch, tmp_path):
    class FakeImage:
        size = (9000, 100)

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    monkeypatch.setattr("PIL.Image.open", lambda path: FakeImage())
    path = tmp_path / "wide.png"
    path.write_bytes(b"fake")
    with pytest.raises(ValueError, match="exceeds maximum"):
        check_image_resolution(str(path))


def test_rejects_image_taller_than_limit(monkeypatch, tmp_path):
    class FakeImage:
        size = (100, 8500)

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    monkeypatch.setattr("PIL.Image.open", lambda path: FakeImage())
    path = tmp_path / "tall.png"
    path.write_bytes(b"fake")
    with pytest.raises(ValueError, match="exceeds maximum"):
        check_image_resolution(str(path))
