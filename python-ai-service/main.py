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

app = Flask(__name__)
CORS(app)

os.makedirs(config.UPLOAD_DIR, exist_ok=True)

# Blueprints 
app.register_blueprint(process_bp)

# Health Check
@app.get("/health")
def health():
    return {"status": "ok", "service": "python-ai-service"}

# Sheet Generator
@app.route("/generate-sheet", methods=["POST"])
def generate_sheet():
    from app.services.sheet_generator import generate_a4_sheet
    
    data = request.get_json() or {}
    photo_path = data.get("photo_path")
    preset_id = data.get("preset_id", "35x45")
    
    # 1. Path existence validation
    if not photo_path:
        return jsonify({"error": "photo_path is required"}), 400
    if not os.path.exists(photo_path):
        return jsonify({"error": f"photo_path file not found: {photo_path}"}), 404

    # 2. Preset ID validation
    allowed_presets = {"35x45", "51x51", "33x48", "40x60", "2x2in"}
    if preset_id not in allowed_presets:
        return jsonify({"error": f"Invalid preset_id. Allowed: {list(allowed_presets)}"}), 400

    # 3. Quantity validation
    try:
        quantity = int(data.get("quantity", 8))
        if quantity <= 0 or quantity > 100:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"error": "quantity must be a positive integer between 1 and 100"}), 400

    # 4. BG Color validation
    bg_color_list = data.get("bg_color", [255, 255, 255])
    if not isinstance(bg_color_list, list) or len(bg_color_list) != 3:
        return jsonify({"error": "bg_color must be a list of 3 RGB values"}), 400
    
    for c in bg_color_list:
        try:
            val = int(c)
            if val < 0 or val > 255:
                raise ValueError
        except (TypeError, ValueError):
            return jsonify({"error": "bg_color RGB values must be integers between 0 and 255"}), 400
            
    bg_color = tuple(bg_color_list)
    draw_guides = bool(data.get("draw_guides", True))

    output_dir = os.environ.get("OUTPUT_DIR", "outputs")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"sheet_{preset_id}.jpg")

    try:
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