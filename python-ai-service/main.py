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

# Health Checks & Diagnostics
@app.get("/health")
def health():
    return {"status": "ok", "service": "python-ai-service"}

@app.get("/health/liveness")
def liveness():
    # Simple check that the server process is alive
    return jsonify({"status": "alive", "message": "Service process is running."}), 200

@app.get("/health/readiness")
def readiness():
    diagnostics = {
        "status": "ready",
        "dependencies": {},
        "storage": {}
    }
    
    # Check OpenCV/Cv2 dependency
    try:
        import cv2
        diagnostics["dependencies"]["opencv"] = "available"
        diagnostics["dependencies"]["opencv_version"] = cv2.__version__
    except ImportError:
        diagnostics["dependencies"]["opencv"] = "missing"
        diagnostics["status"] = "unhealthy"

    # Check PIL dependency
    try:
        from PIL import Image
        diagnostics["dependencies"]["pillow"] = "available"
    except ImportError:
        diagnostics["dependencies"]["pillow"] = "missing"
        diagnostics["status"] = "unhealthy"

    # Check file system write access in upload dir
    try:
        test_file = os.path.join(config.UPLOAD_DIR, ".readiness_test")
        with open(test_file, "w") as f:
            f.write("test")
        os.remove(test_file)
        diagnostics["storage"]["upload_dir_writable"] = True
    except Exception as e:
        diagnostics["storage"]["upload_dir_writable"] = False
        diagnostics["storage"]["error"] = str(e)
        diagnostics["status"] = "unhealthy"

    code = 200 if diagnostics["status"] == "ready" else 503
    return jsonify(diagnostics), code

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