import logging
import os
import uuid
from flask import Blueprint, request, jsonify, send_file
import config
from app.services.bg_remove import remove_background
from app.services.face_center import center_face
from app.services.dpi_optimizer import optimise_dpi

logger = logging.getLogger(__name__)
process_bp= Blueprint("process", __name__)


@process_bp.post("/remove-bg")
def remove_bg():
    """
    Test endpoint — background removal only.
    POST multipart/form-data:
      - image             : photo file (required)
      - background_colour : "white" / "blue" / "#ff0000" (optional, default white)
    Returns the processed PNG directly in the response.
    """
    if "image" not in request.files:
        return jsonify({"success": False, "message": "No image file provided."}), 400

    file=request.files["image"]
    if file.filename== "":
        return jsonify({"success": False, "message": "Empty filename."}), 400

    bg_colour = request.form.get("background_colour", "white")

    preset = request.form.get("preset") or request.form.get("photo_size_preset") or "35x45"

    try:
        image_bytes= file.read()
        result_bytes= remove_background(image_bytes, bg_colour)
        centered = center_face(result_bytes)
        final_image = optimise_dpi(centered, preset)

        filename= f"{uuid.uuid4().hex}.png"
        save_path= os.path.join(config.UPLOAD_DIR, filename)
        with open(save_path, "wb") as f:
            f.write(final_image)

        return send_file(
            save_path,
            mimetype="image/png",
            as_attachment=False,
            download_name=filename,
        )
    except ValueError as e:
        # Log the original message server-side for debugging but return a
        # fixed client message — ValueError can originate from third-party
        # libraries (Pillow, rembg) whose messages may include internal paths.
        logger.warning("remove_bg validation error: %s", e)
        return jsonify({"success": False, "message": "Invalid image or processing parameters. Please check your input and try again."}), 422
    except Exception:
        # Log full traceback server-side; return a generic message to the client
        # so internal filesystem paths and library internals are never exposed.
        logger.exception("Unhandled error in /remove-bg")
        return jsonify({"success": False, "message": "Background removal failed. Please try again."}), 500
