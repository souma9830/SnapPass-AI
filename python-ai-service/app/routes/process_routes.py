import os
import uuid
import zipfile
import io
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

@process_bp.post("/batch-process")
def batch_process():
    """
    Batch process multiple images at once, returning a ZIP file.
    POST multipart/form-data:
      - images (multiple files)
      - background_colour, preset, country_standard, etc.
    """
    if "images" not in request.files:
        return jsonify({"success": False, "message": "No images provided."}), 400

    files = request.files.getlist("images")
    if not files:
        return jsonify({"success": False, "message": "Empty file list."}), 400

    bg_colour = request.form.get("background_colour", "white")
    attire = request.form.get("attire", "none")
    preset = request.form.get("preset") or request.form.get("photo_size_preset") or "35x45"
    country_standard = request.form.get("country_standard", "default")
    
    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zf:
        for i, file in enumerate(files):
            if file.filename == "":
                continue
            
            try:
                image_bytes = file.read()
                
                if request.form.get("upscale_image", "false").lower() == "true":
                    from app.services.upscale import upscale_image
                    image_bytes = upscale_image(image_bytes)
                    
                if request.form.get("check_expression", "false").lower() == "true":
                    from app.services.facial_expression import analyze_facial_expression
                    if not analyze_facial_expression(image_bytes)["is_neutral"]:
                        continue # Skip non-neutral images in batch mode
                        
                if request.form.get("correct_red_eye", "false").lower() == "true":
                    from app.services.red_eye_correction import correct_red_eye
                    image_bytes = correct_red_eye(image_bytes)
                    
                if request.form.get("reduce_glare", "false").lower() == "true":
                    from app.services.glare_reduction import reduce_glasses_glare
                    image_bytes = reduce_glasses_glare(image_bytes)

                result_bytes = remove_background(image_bytes, bg_colour, attire)
                centered = center_face(result_bytes, country_standard)
                final_image = optimise_dpi(centered, preset)
                
                zf.writestr(f"processed_{i}_{file.filename}.png", final_image)
            except Exception as e:
                # Log error and continue with next file
                print(f"Error processing {file.filename}: {e}")
                
    memory_file.seek(0)
    
    return send_file(
        memory_file,
        mimetype="application/zip",
        as_attachment=True,
        download_name=f"snappass_batch_{uuid.uuid4().hex[:8]}.zip"
    )
