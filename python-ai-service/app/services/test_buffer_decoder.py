"""
test_buffer_decoder.py — Buffer Decoder Tests
Built for ELUSoC 2026 / GSSOC 2026.
"""
from app.services.image_buffer_decoder import decode_image_buffer

def test_decode_empty():
    assert decode_image_buffer(b"") is None
