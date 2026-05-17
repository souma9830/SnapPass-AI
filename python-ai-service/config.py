import os
from dotenv import load_dotenv

load_dotenv()

PORT=int(os.getenv("PORT", 8000))
DEBUG=os.getenv("FLASK_DEBUG", "false").lower() == "true"
UPLOAD_DIR=os.getenv("UPLOAD_DIR", "uploads")
MAX_FILE_MB=int(os.getenv("MAX_FILE_MB", 10))

TARGET_DPI=300