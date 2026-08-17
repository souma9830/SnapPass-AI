from flask import Blueprint, request, jsonify
import cv2
from app.services.compliance_inspector import inspect_compliance
from app.services.facial_asymmetry_analyzer import FacialAsymmetryAnalyzer
from app.services.path_guard import safe_photo_path, validate_magic_bytes

compliance_bp = Blueprint("compliance", __name__)
asymmetry_analyzer = FacialAsymmetryAnalyzer()

@compliance_bp.post("/asymmetry")
def analyze_facial_asymmetry_route():
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path")
    if not file_path:
        return jsonify({"error": "file_path is required"}), 400

    try:
        resolved_path = safe_photo_path(file_path)
        img = cv2.imread(resolved_path)
        res = asymmetry_analyzer.analyze_facial_symmetry(img)
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@compliance_bp.post("/check")
def compliance_check():
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path")
    size_preset = data.get("size_preset")
    if not file_path:
        return jsonify({"error": "file_path is required"}), 400

    try:
        safe_photo_path(file_path)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    try:
        report = inspect_compliance(file_path, size_preset)
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@compliance_bp.post("/check-batch")
def compliance_check_batch():
    data = request.get_json(silent=True) or {}
    file_paths = data.get("file_paths", [])
    size_preset = data.get("size_preset", "35x45")

    if not isinstance(file_paths, list) or len(file_paths) == 0:
        return jsonify({"error": "file_paths must be a non-empty array"}), 400

    results = []
    for path in file_paths:
        try:
            safe_photo_path(path)
        except ValueError as exc:
            results.append({"file_path": path, "error": str(exc)})
            continue
        try:
            report = inspect_compliance(path, size_preset)
            results.append({"file_path": path, "report": report})
        except Exception as err:
            results.append({"file_path": path, "error": str(err)})

    return jsonify({"total": len(results), "results": results})


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
        safe_photo_path(file_path)
        validate_magic_bytes(file_path)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    try:
        import cv2
        import numpy as np

        image = cv2.imread(file_path)
        if image is None:
            return jsonify({"error": "Could not read image"}), 400

        if issue == "tilt":
            from app.services.face_align import auto_rotate
            with open(file_path, "rb") as f:
                img_bytes = f.read()

            try:
                result = auto_rotate(img_bytes)
                with open(file_path, "wb") as f:
                    f.write(result.corrected_bytes)
                if abs(result.roll_degrees) < 0.1:
                    return jsonify({"success": True, "message": "Head is already level"})
                return jsonify({"success": True, "message": "Tilt corrected successfully", "roll_degrees": result.roll_degrees})
            except ValueError as ve:
                return jsonify({"error": str(ve)}), 422

        elif issue == "auto-rotate":
            from app.services.face_align import auto_rotate
            with open(file_path, "rb") as f:
                img_bytes = f.read()

            try:
                result = auto_rotate(img_bytes)
                with open(file_path, "wb") as f:
                    f.write(result.corrected_bytes)
                if abs(result.roll_degrees) < 0.1:
                    return jsonify({"success": True, "message": "Image is already level"})
                return jsonify({
                    "success": True,
                    "message": "Auto-rotation applied",
                    "roll_degrees": result.roll_degrees,
                    "eyes_detected": result.eyes_detected,
                })
            except ValueError as ve:
                return jsonify({"error": str(ve)}), 422

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


@compliance_bp.post("/analyze-lighting")
def compliance_analyze_lighting():
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path")
    if not file_path:
        return jsonify({"error": "file_path is required"}), 400

    try:
        safe_photo_path(file_path)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    try:
        from app.services.lighting_analyzer import analyze_facial_lighting
        with open(file_path, "rb") as f:
            img_bytes = f.read()
        report = analyze_facial_lighting(img_bytes)
        return jsonify({"success": True, "data": report})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

