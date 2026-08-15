"""
test_cors_configurator.py — CORS Configurator Tests
Built for ELUSoC 2026 / GSSOC 2026.
"""
from app.services.cors_configurator import configure_strict_cors
from flask import Flask

def test_cors_configure():
    app = Flask(__name__)
    origins = configure_strict_cors(app)
    assert len(origins) > 0
