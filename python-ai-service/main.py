"""
main.py
Flask entry point for the SnapPass AI Python service.
Runs on http://localhost:8000
"""

import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import config
from app.routes.process_routes import process_bp
from app.services.errors import ai_error_handler

app = Flask(__name__)
CORS(app)

os.makedirs(config.UPLOAD_DIR, exist_ok=True)

# Blueprints 
app.register_blueprint(process_bp)

# Health Check
@app.get("/health")
def health():
    return {"status": "ok", "service": "python-ai-service"}
# Face Quality Gate
@app.route("/face-quality-check", methods=["POST"])
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
@ai_error_handler
def generate_sheet():
    from app.services.sheet_generator import generate_a4_sheet
    
    data= request.get_json()
    photo_path= data.get("photo_path")
    preset_id= data.get("preset_id", "35x45")
    quantity= int(data.get("quantity", 8))
    bg_color= tuple(data.get("bg_color", [255, 255, 255]))
    draw_guides= bool(data.get("draw_guides", True))

    if not photo_path:
        return jsonify({"error": "photo_path is required"}), 400

    output_dir= os.environ.get("OUTPUT_DIR", "outputs")
    os.makedirs(output_dir, exist_ok=True)
    output_path= os.path.join(output_dir, f"sheet_{preset_id}.jpg")

    from app.services.sheet_generator import generate_a4_sheet
    saved = generate_a4_sheet(
        photo_path= photo_path,
        preset_id= preset_id,
        quantity= quantity,
        bg_color= bg_color,
        draw_guides= draw_guides,
        output_path= output_path,
    )
    return send_file(saved, mimetype="image/jpeg")

# Run 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG)