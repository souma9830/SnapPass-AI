import os
import cv2
import numpy as np
from PIL import Image

def apply_attire_swap(foreground: Image.Image, attire_name: str) -> Image.Image:
    """
    Detects the face in the transparent foreground image and aligns/overlays
    the specified formal attire template over the user's shoulders.
    
    Args:
        foreground: PIL Image in RGBA format (background removed).
        attire_name: Name of the attire template (e.g. 'male_suit', 'female_blazer').
        
    Returns:
        Modified PIL Image with the formal attire overlaid.
    """
    # 1. Convert PIL Image to OpenCV BGR for face detection
    img_np = np.array(foreground)
    
    # Use only the RGB channels for face detection
    img_bgr = cv2.cvtColor(img_np[:, :, :3], cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    
    # 2. Detect face using Haar Cascade
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(100, 100)
    )
    
    if len(faces) == 0:
        raise ValueError(
            "Could not detect face for attire alignment. "
            "Please ensure your face is clearly visible, well-lit, and facing the camera directly."
        )
        
    # Get the largest face
    fx, fy, fw, fh = max(faces, key=lambda r: r[2] * r[3])
    
    # 3. Load the attire template
    assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "attire")
    template_path = os.path.join(assets_dir, f"{attire_name}.png")
    if not os.path.exists(template_path):
        raise ValueError(f"Attire template '{attire_name}' not found.")
        
    template = Image.open(template_path).convert("RGBA")
    temp_w, temp_h = template.size
    
    # 4. Calculate scaling & positioning
    # Shoulders width is approximately 2.6 times the face width
    suit_w = int(fw * 2.6)
    scale = suit_w / temp_w
    suit_h = int(temp_h * scale)
    
    # Resize the suit template
    resized_suit = template.resize((suit_w, suit_h), Image.Resampling.LANCZOS)
    
    # Align horizontal center
    face_cx = fx + fw // 2
    suit_x = face_cx - suit_w // 2
    
    # Align collar to chin/neck area
    chin_y = fy + fh
    # Overlap suit collar slightly above the chin (8% of face height) to cover original collar
    overlap = int(fh * 0.08)
    suit_y = chin_y - overlap
    
    # 5. Erase original body below chin to prevent casual clothes sticking out
    # Keep only the neck column of width 0.85 * fw centered at face_cx
    h_img, w_img, _ = img_np.shape
    neck_w = int(fw * 0.85)
    neck_left = face_cx - neck_w // 2
    neck_right = face_cx + neck_w // 2
    
    # Create mask: 1 to keep, 0 to erase
    keep_mask = np.ones((h_img, w_img), dtype=np.uint8)
    
    # Below chin_y, erase everything outside the neck column
    for y_idx in range(max(0, chin_y - overlap), h_img):
        keep_mask[y_idx, :max(0, neck_left)] = 0
        keep_mask[y_idx, min(w_img, neck_right):] = 0
        
    # Apply mask to alpha channel
    img_np[:, :, 3] = img_np[:, :, 3] * keep_mask
    masked_foreground = Image.fromarray(img_np, "RGBA")
    
    # 6. Paste suit onto canvas and alpha-composite
    suit_canvas = Image.new("RGBA", masked_foreground.size, (0, 0, 0, 0))
    suit_canvas.paste(resized_suit, (suit_x, suit_y), resized_suit)
    
    final_foreground = Image.alpha_composite(masked_foreground, suit_canvas)
    return final_foreground
