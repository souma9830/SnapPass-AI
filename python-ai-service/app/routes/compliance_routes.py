from flask import Blueprint, request, jsonify
from app.services.compliance_inspector import inspect_compliance

compliance_bp = Blueprint("compliance", __name__)

@compliance_bp.post("/check")
def compliance_check():
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path")
    size_preset = data.get("size_preset")
    if not file_path:
        return jsonify({"error": "file_path is required"}), 400

    try:
        report = inspect_compliance(file_path, size_preset)
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@compliance_bp.post("/auto-correct")
def compliance_auto_correct():
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path")
    issue = data.get("issue")
    
    if not file_path:
        return jsonify({"error": "file_path is required"}), 400
    if not issue:
        return jsonify({"error": "issue is required"}), 400

    try:
        import cv2
        import numpy as np
        
        image = cv2.imread(file_path)
        if image is None:
            return jsonify({"error": "Could not read image"}), 400
            
        if issue == "tilt":
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            from app.services.compliance_inspector import _detect_face, _detect_eyes_and_get_tilt
            face_rect = _detect_face(gray)
            if not face_rect:
                return jsonify({"error": "No face detected for auto-tilt alignment"}), 422
                
            roll_deg, _ = _detect_eyes_and_get_tilt(gray, face_rect)
            if abs(roll_deg) < 0.1:
                return jsonify({"success": True, "message": "Head is already level"})
                
            h, w = image.shape[:2]
            fx, fy, fw, fh = face_rect
            center = (fx + fw // 2, fy + fh // 2)
            
            # Rotate by -roll_deg to straighten
            matrix = cv2.getRotationMatrix2D(center, -roll_deg, 1.0)
            rotated = cv2.warpAffine(image, matrix, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(255, 255, 255))
            
            cv2.imwrite(file_path, rotated)
            return jsonify({"success": True, "message": "Tilt corrected successfully"})
            
        elif issue == "center" or issue == "dimensions":
            from app.services.face_center import center_face
            with open(file_path, "rb") as f:
                img_bytes = f.read()
            
            try:
                centered_bytes = center_face(img_bytes)
                with open(file_path, "wb") as f:
                    f.write(centered_bytes)
                return jsonify({"success": True, "message": "Face centered and scaled successfully"})
            except ValueError as ve:
                return jsonify({"error": str(ve)}), 422
                
        elif issue == "background":
            from app.services.bg_remove import remove_background
            with open(file_path, "rb") as f:
                img_bytes = f.read()
                
            try:
                no_bg_bytes = remove_background(img_bytes, "white", "none")
                with open(file_path, "wb") as f:
                    f.write(no_bg_bytes)
                return jsonify({"success": True, "message": "Background removed and replaced with white"})
            except Exception as e:
                return jsonify({"error": f"Failed to remove background: {str(e)}"}), 500
                
        else:
            return jsonify({"error": f"Unsupported auto-correct issue: {issue}"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500


