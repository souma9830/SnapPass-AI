import os
import uuid
from flask import Blueprint, request, jsonify, send_file
import config
from app.services.bg_remove import remove_background
from app.services.face_center import center_face
from app.services.dpi_optimizer import optimise_dpi
process_bp = Blueprint("process", __name__)


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
        cloud_provider = request.form.get("cloud_provider")
        cloud_file_id = request.form.get("cloud_file_id")
        cloud_token = request.form.get("cloud_token")
        
        if not cloud_provider or not cloud_file_id:
            return jsonify(
                {"success": False, "message": "No image file provided, and cloud import details are missing."}), 400
        
        # We will load the bytes from cloud instead of the request payload
        from app.services.cloud_storage import fetch_from_cloud
        try:
            image_bytes = fetch_from_cloud(cloud_provider, cloud_file_id, cloud_token)
        except NotImplementedError as e:
            return jsonify({"success": False, "message": str(e)}), 501
            
        file_placeholder = True
    else:
        file = request.files["image"]
        if file.filename == "":
            return jsonify({"success": False, "message": "Empty filename."}), 400
        file_placeholder = False

    bg_colour = request.form.get("background_colour", "white")
    attire = request.form.get("attire", "none")

    preset = request.form.get("preset") or request.form.get(
        "photo_size_preset") or "35x45"

    try:
        if not file_placeholder:
            image_bytes = file.read()
        result_bytes = remove_background(image_bytes, bg_colour, attire)
        centered = center_face(result_bytes)
        final_image = optimise_dpi(centered, preset)

        filename = f"{uuid.uuid4().hex}.png"
        save_path = os.path.join(config.UPLOAD_DIR, filename)
        with open(save_path, "wb") as f:
            f.write(final_image)

        return send_file(
            save_path,
            mimetype="image/png",
            as_attachment=False,
            download_name=filename,
        )
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 422
    except Exception as e:
        return jsonify(
            {"success": False, "message": "Background removal failed.", "detail": str(e)}), 500
