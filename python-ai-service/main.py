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
from app.utils.logger import logger

app = Flask(__name__)
CORS(app)

os.makedirs(config.UPLOAD_DIR, exist_ok=True)
logger.info("Starting SnapPass AI Python service...")

# Blueprints 
app.register_blueprint(process_bp)

# Health Check
@app.get("/health")
def health():
    logger.debug("Received health check request")
    return {"status": "ok", "service": "python-ai-service"}

# Sheet Generator
@app.route("/generate-sheet", methods=["POST"])
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

    try:
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

    except (ValueError, FileNotFoundError) as e:
        return jsonify({"error": str(e)}), 400

# Run 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG)