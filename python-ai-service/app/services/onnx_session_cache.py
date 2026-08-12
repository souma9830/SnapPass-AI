"""
onnx_session_cache.py — RemBG ONNX Session Cache Manager
Built for ELUSoC 2026 / GSSOC 2026.
"""
class OnnxSessionCacheManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(OnnxSessionCacheManager, cls).__new__(cls)
            cls._instance.sessions = {}
        return cls._instance

    def get_session(self, model_name: str = "u2net"):
        if model_name not in self.sessions:
            # Simulate lazy instantiation of ONNX model session
            self.sessions[model_name] = f"MOCK_ONNX_SESSION_{model_name.upper()}"
        return self.sessions[model_name]

onnx_cache = OnnxSessionCacheManager()
