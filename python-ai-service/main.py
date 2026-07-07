"""
main.py
Flask entry point for the SnapPass AI Python service.
Runs on http://localhost:8000
"""

import logging
import os
import pathlib
import re
import uuid
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import config
from app.routes.process_routes import process_bp
from app.routes.compliance_routes import compliance_bp
from app.services.errors import ai_error_handler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def validate_file_magic(file_path: str) -> bool:
    # Basic check for JPEG, PNG, WEBP magic bytes
    try:
        with open(file_path, "rb") as f:
            header = f.read(4)
            if header.startswith(b"\xff\xd8\xff"):  # JPEG
                return True
            if header.startswith(b"\x89PNG"):  # PNG
                return True
            if header.startswith(b"RIFF") and b"WEBP" in header:  # WEBP
                return True
    except Exception:
        pass
    return False


def _safe_photo_path(raw: str) -> str:
    """
    Resolve raw to an absolute path and confirm it sits inside UPLOAD_DIR.

    Uses pathlib.Path.relative_to() for a boundary check that is immune to
    prefix-match false positives (e.g. /uploads_evil/ matching /uploads).
    Strips directory traversal from the input by taking only the filename
    component before resolving.

    Args:
        raw: The photo_path value received from the request body.

    Returns:
        The resolved absolute path string if it is within UPLOAD_DIR.

    Raises:
        ValueError: If the resolved path is outside UPLOAD_DIR.
    """
    allowed_dir = pathlib.Path(config.UPLOAD_DIR).resolve()
    # Use only the final filename component — strip any directory traversal.
    resolved = (allowed_dir / pathlib.Path(raw).name).resolve()
    try:
        resolved.relative_to(allowed_dir)
    except ValueError:
        raise ValueError(
            "Invalid photo_path: file is outside the allowed upload directory.")
    return str(resolved)


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = config.MAX_FILE_MB * 1024 * 1024
CORS(app)

limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["60 per minute"],
    storage_uri="memory://",
)


@app.errorhandler(429)
def rate_limit_handler(e):
    return jsonify({"error": "Too many requests. Please slow down.", "retry_after": 60}), 429, {"Retry-After": "60"}


@app.before_request
def check_payload_size():
    max_bytes = config.MAX_FILE_MB * 1024 * 1024
    if request.content_length and request.content_length > max_bytes:
        return jsonify({
            "error": f"Payload too large. Maximum allowed: {config.MAX_FILE_MB} MB."
        }), 413


os.makedirs(config.UPLOAD_DIR, exist_ok=True)

# Blueprints
app.register_blueprint(process_bp)
app.register_blueprint(compliance_bp)



# Health Check
@app.get("/health")
def health():
    return {"status": "ok", "service": "python-ai-service"}


# Face Quality Gate
@app.route("/face-quality-check", methods=["POST"])
@limiter.limit("10 per minute")
def face_quality_check():
    from app.services.face_quality_gate import assess_face_quality

    data = request.get_json()
    file_path = data.get("file_path")

    if not file_path:
        return jsonify({"error": "file_path is required"}), 400

    try:
        report = assess_face_quality(file_path)
        return jsonify({
            "passed": report.passed,
            "face_count": report.face_count,
            "blur_score": report.blur_score,
            "rejection_code": report.rejection_code,
            "rejection_reason": report.rejection_reason,
            "user_hint": report.user_hint,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Sheet Generator
@app.route("/generate-sheet", methods=["POST"])
@limiter.limit("10 per minute")
@ai_error_handler
def generate_sheet():
    from app.services.sheet_generator import generate_sheet

    data = request.get_json()
    raw_photo_path = data.get("photo_path")
    preset_id = re.sub(
        r"[^a-zA-Z0-9_\-]",
        "",
        data.get(
            "preset_id",
            "35x45")) or "35x45"
    quantity = int(data.get("quantity", 8))
    page_size = data.get("page_size", "a4")
    bg_color = tuple(data.get("bg_color", [255, 255, 255]))
    draw_guides = bool(data.get("draw_guides", True))

    allowed_sizes = ["a4", "letter", "4x6"]
    if page_size not in allowed_sizes:
        return jsonify({"error": f"Invalid page_size. Choose from: {allowed_sizes}"}), 400

    if not raw_photo_path:
        return jsonify({"error": "photo_path is required"}), 400

    try:
        photo_path = _safe_photo_path(raw_photo_path)
    except ValueError:
        return jsonify({"error": "Invalid photo_path."}), 400

    output_dir = os.environ.get("OUTPUT_DIR", "outputs")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(
        output_dir, f"sheet_{preset_id}_{page_size}_{uuid.uuid4().hex}.jpg")

    saved = generate_sheet(
        photo_path=photo_path,
        preset_id=preset_id,
        quantity=quantity,
        page_size=page_size,
        bg_color=bg_color,
        draw_guides=draw_guides,
        output_path=output_path,
    )

    # Build the response first, then register cleanup via call_on_close so
    # the file is only deleted after the WSGI server has finished sending
    # all bytes — safer than after_this_request which can fire before
    # transmission completes and fails on Windows while the handle is open.
    response = send_file(saved, mimetype="image/jpeg")
    saved_path = saved

    def _delete_sheet():
        try:
            os.unlink(saved_path)
        except OSError:
            logger.warning("Could not delete sheet file: %s", saved_path)

    response.call_on_close(_delete_sheet)
    return response



# NOTE: Compliance endpoint wired via Blueprint above.

# Run
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG)
