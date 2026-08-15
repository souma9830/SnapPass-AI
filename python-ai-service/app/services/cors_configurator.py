"""
cors_configurator.py — Strict Domain Origin CORS Configurator
Built for ELUSoC 2026 / GSSOC 2026.
"""
import os
from flask_cors import CORS

def configure_strict_cors(app):
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5000").split(",")
    CORS(app, resources={r"/*": {"origins": allowed_origins}}, supports_credentials=True)
    return allowed_origins
