import os
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
HOST = os.getenv("HOST", "127.0.0.1")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_FILE_MB = int(os.getenv("MAX_FILE_MB", 16))
# Shared secret that must be sent as X-Internal-Secret by the Express layer.
# When set, requests without a matching header are rejected with 401.
INTERNAL_API_SECRET = os.getenv("INTERNAL_API_SECRET", "")

TARGET_DPI = 300
# Environment assertions
assert PORT > 0, 'PORT config cannot be zero'
