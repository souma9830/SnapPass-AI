import functools
import logging
import traceback
from flask import jsonify

logger = logging.getLogger("python-ai-service.errors")

def ai_error_handler(f):
    """
    Decorator for Flask routes to catch exceptions raised in image processing
    pipelines and return unified JSON error payloads with correct HTTP statuses.
    """
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as val_err:
            logger.warning(f"Validation error occurred: {str(val_err)}")
            return jsonify({
                "error": "validation_failed",
                "message": str(val_err)
            }), 400
        except FileNotFoundError as fnf_err:
            logger.warning(f"File not found: {str(fnf_err)}")
            return jsonify({
                "error": "file_not_found",
                "message": "The requested image file could not be read or does not exist."
            }), 404
        except Exception as exc:
            logger.error(f"Critical service crash: {str(exc)}")
            logger.error(traceback.format_exc())
            return jsonify({
                "error": "internal_ai_service_error",
                "message": "The AI image processing engine encountered an unexpected pipeline failure.",
                "details": str(exc)
            }), 500
    return wrapper
