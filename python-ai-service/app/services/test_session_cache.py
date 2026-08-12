"""
test_session_cache.py — ONNX Session Cache Tests
Built for ELUSoC 2026 / GSSOC 2026.
"""
from app.services.onnx_session_cache import onnx_cache

def test_onnx_cache_singleton():
    s1 = onnx_cache.get_session("u2net")
    s2 = onnx_cache.get_session("u2net")
    assert s1 == s2
