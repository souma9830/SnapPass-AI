import os
import uuid
from flask import Blueprint, request, jsonify, send_file
import config
from app.services.bg_remove import remove_background
from app.services.face_center import center_face
from app.services.dpi_optimizer import optimise_dpi
from app.services.path_guard import validate_magic_bytes

process_bp = Blueprint("process", __name__)


@process_bp.post("/remove-bg")
def remove_bg():
    """
    Background removal endpoint.
    POST multipart/form-data:
      - image             : photo file (required)
      - background_colour : "white" / "blue" / "#ff0000" (optional, default white)
    Returns the processed PNG directly in the response.
    """
    if "image" not in request.files:
        return jsonify(
            {"success": False, "message": "No image file provided."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"success": False, "message": "Empty filename."}), 400

    bg_colour = request.form.get("background_colour", "white")
    attire = request.form.get("attire", "none")

    preset = request.form.get("preset") or request.form.get(
        "photo_size_preset") or "35x45"

    try:
        image_bytes = file.read()
        validate_magic_bytes.__wrapped__ if hasattr(validate_magic_bytes, '__wrapped__') else None
        _tmp_path = os.path.join(config.UPLOAD_DIR, f"_validate_{uuid.uuid4().hex}.tmp")
        os.makedirs(config.UPLOAD_DIR, exist_ok=True)
        with open(_tmp_path, "wb") as _f:
            _f.write(image_bytes)
        try:
            validate_magic_bytes(_tmp_path)
        finally:
            try:
                os.unlink(_tmp_path)
            except OSError:
                pass

        result_bytes = remove_background(image_bytes, bg_colour, attire)
        centered = center_face(result_bytes)
        final_image = optimise_dpi(centered, preset)

        filename = f"{uuid.uuid4().hex}.png"
        save_path = os.path.join(config.UPLOAD_DIR, filename)
        with open(save_path, "wb") as f:
            f.write(final_image)

        response = send_file(
            save_path,
            mimetype="image/png",
            as_attachment=False,
            download_name=filename,
        )

        def _cleanup():
            try:
                os.unlink(save_path)
            except OSError:
                pass

        response.call_on_close(_cleanup)
        return response
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 422
    except Exception as e:
        return jsonify(
            {"success": False, "message": "Background removal failed.", "detail": str(e)}), 500
