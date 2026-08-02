import cv2
import numpy as np
from PIL import Image
import io

def correct_lighting_and_shadows(image_bytes: bytes) -> bytes:
    """
    Applies adaptive histogram equalization (CLAHE) to normalize lighting
    and reduce harsh shadows, simulating an AI smart lighting adjustment.
    """
    img_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_np = np.array(img_pil)

    # Convert to LAB color space for luminance adjustment
    lab = cv2.cvtColor(img_np, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)

    # Apply CLAHE to L-channel
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)

    # Merge channels and convert back to RGB
    limg = cv2.merge((cl, a, b))
    final_np = cv2.cvtColor(limg, cv2.COLOR_LAB2RGB)

    final_pil = Image.fromarray(final_np)
    output = io.BytesIO()
    final_pil.save(output, format="JPEG", quality=95)
    
    return output.getvalue()
