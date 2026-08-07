import os
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_FILE_MB = int(os.getenv("MAX_FILE_MB", 16))

TARGET_DPI = 300
MAX_QUANTITY = 50
MIN_QUANTITY = 1
ALLOWED_PAGE_SIZES = {"a4", "letter", "4x6"}
ALLOWED_PRESETS = {
    "35x45", "51x51", "33x48", "40x60", "2x2in",
    "100x150", "25x25", "50x70", "45x45", "35x50",
}

# Environment assertions
assert PORT > 0, 'PORT config cannot be zero'
