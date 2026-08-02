import cv2
import numpy as np

def analyze_clothing_compliance(image_bytes: bytes, target_bg_colour: str) -> dict:
    """
    Analyzes the subject's clothing for passport compliance.
    Returns a dictionary containing a boolean 'compliant' flag and a list of 'warnings'.
    
    Checks simulated in this stub:
    1. Uniform / Camouflage detection (mocked via texture analysis)
    2. Insufficient contrast against target background color
    """
    warnings = []
    
    # In a real implementation, we would pass this through a specialized classifier.
    # Here we mock it by doing a basic dominant color extraction of the lower third of the image (chest area).
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    if img is None:
        return {"compliant": True, "warnings": []}
        
    height, width, _ = img.shape
    chest_region = img[int(height*0.7):height, int(width*0.2):int(width*0.8)]
    
    if chest_region.size > 0:
        # Calculate standard deviation of color to guess if it's "camouflage/patterned"
        std_dev = np.std(chest_region)
        if std_dev > 60:
            warnings.append("Clothing appears heavily patterned or textured. Uniforms and camouflage are prohibited.")
            
        # Very basic check: If the user requests a white background, and the clothing is extremely bright
        if target_bg_colour.lower() in ["white", "#ffffff"]:
            mean_brightness = np.mean(chest_region)
            if mean_brightness > 220:
                warnings.append("Clothing color is too light and may blend into the white background. High contrast is required.")
                
    return {
        "compliant": len(warnings) == 0,
        "warnings": warnings
    }
