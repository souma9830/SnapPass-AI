"""
main.py
Flask entry point for the SnapPass AI Python service.
Runs on http://localhost:8000
"""

import logging
import os
import re
import uuid
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import config
from app.routes.process_routes import process_bp
from app.routes.compliance_routes import compliance_bp
from app.services.path_guard import safe_photo_path, validate_magic_bytes

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


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

    data = request.get_json(silent=True) or {}
    raw_path = data.get("file_path")

    if not raw_path:
        return jsonify({"error": "file_path is required"}), 400

    try:
        file_path = safe_photo_path(raw_path)
        validate_magic_bytes(file_path)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

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
    from app.services.path_guard import safe_photo_path

    data = request.get_json(silent=True) or {}
    raw_photo_path = data.get("photo_path")
    raw_photo_paths = data.get("photo_paths")
    preset_id = re.sub(
        r"[^a-zA-Z0-9_\-]",
        "",
        data.get(
            "preset_id",
            "35x45")) or "35x45"

    try:
        quantity = int(data.get("quantity", 8))
    except (TypeError, ValueError):
        return jsonify({"error": "quantity must be an integer."}), 400

    if quantity < 1:
        return jsonify({"error": "quantity must be at least 1."}), 400

    if quantity > 50:
        return jsonify({"error": "quantity must not exceed 50."}), 400

    raw_bg = data.get("bg_color", [255, 255, 255])
    if not isinstance(raw_bg, list) or len(raw_bg) != 3:
        return jsonify({"error": "bg_color must be an array of 3 integers."}), 400
    try:
        bg_color = tuple(int(c) for c in raw_bg)
    except (TypeError, ValueError):
        return jsonify({"error": "bg_color values must be integers."}), 400

    draw_guides_raw = data.get("draw_guides", True)
    draw_guides = str(draw_guides_raw).lower() != "false"

    draw_guides_raw = data.get("draw_guides", True)
    draw_guides = str(draw_guides_raw).lower() != "false"

    page_size = data.get("page_size", "a4")
    allowed_sizes = ["a4", "letter", "4x6"]
    if page_size not in allowed_sizes:
        return jsonify({"error": f"Invalid page_size. Choose from: {allowed_sizes}"}), 400

    input_paths = raw_photo_paths or ([raw_photo_path] if raw_photo_path else [])

    if not input_paths:
        return jsonify({"error": "photo_path or photo_paths is required"}), 400

    if isinstance(input_paths, str):
        input_paths = [input_paths]

    try:
        photo_paths = [safe_photo_path(p) for p in input_paths]
    except ValueError:
        return jsonify({"error": "Invalid photo_path."}), 400

    output_dir = os.environ.get("OUTPUT_DIR", "outputs")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(
        output_dir, f"sheet_{preset_id}_{page_size}_{uuid.uuid4().hex}.jpg")

    saved = generate_sheet(
        photo_paths=photo_paths,
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
