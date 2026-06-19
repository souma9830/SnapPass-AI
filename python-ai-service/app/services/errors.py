from functools import wraps
from flask import jsonify
from werkzeug.exceptions import HTTPException
import logging

logger = logging.getLogger(__name__)

class ImageProcessingError(Exception):
    """Base exception for image operations failures."""
    pass

class FaceNotFoundError(ImageProcessingError):
    """Raised when face detector finds 0 faces."""
    pass

def ai_error_handler(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except HTTPException as e:
            raise
        except FaceNotFoundError as e:
            logger.warning("Face not found: %s", str(e))
            return jsonify({"error": "No face detected in the image.", "code": "FACE_NOT_FOUND"}), 422
        except ImageProcessingError as e:
            logger.error("Image processing error: %s", str(e))
            return jsonify({"error": "Image processing failed.", "code": "PROCESSING_ERROR"}), 500
        except Exception as e:
            logger.exception("Unexpected error: %s", str(e))
            return jsonify({"error": "An unexpected error occurred.", "code": "INTERNAL_ERROR"}), 500
    return decorated_function
