# Compatibility module: exposes the service configuration through the
# app package namespace. Referenced by app/services/path_guard.py as
# `from app.config import UPLOAD_DIR` (the root config.py is the
# canonical source).
from config import *  # noqa: F401,F403