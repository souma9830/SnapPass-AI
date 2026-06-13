from functools import wraps
from flask import jsonify

class ImageProcessingError(Exception):
    """Base exception for image operations failures."""
    pass

class FaceNotFoundError(ImageProcessingError):
    """Raised when face detector finds 0 faces."""
    pass

def ai_error_handler(f):
    """Decorator that catches AI service errors and returns JSON responses."""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except FaceNotFoundError as e:
            return jsonify({"success": False, "message": str(e)}), 422
        except ImageProcessingError as e:
            return jsonify({"success": False, "message": str(e)}), 500
        except ValueError as e:
            return jsonify({"success": False, "message": str(e)}), 400
        except Exception as e:
            return jsonify({"success": False, "message": "Internal server error.", "detail": str(e)}), 500
    return decorated
    
    class ImageProcessingError(Exception):
    """Base exception for image operations failures."""
    pass


class FaceNotFoundError(ImageProcessingError):
    """Raised when face detector finds 0 faces."""
    pass
