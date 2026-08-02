import cv2
import numpy as np
from PIL import Image
import io

def upscale_image(image_bytes: bytes) -> bytes:
    """
    Intelligently upscales low-quality images to meet printing DPI requirements.
    (Stub implementation using OpenCV INTER_CUBIC interpolation. 
    In a full production environment, this would call a loaded ONNX/PyTorch model like Real-ESRGAN).
    """
    img_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_np = np.array(img_pil)
    
    # Convert to BGR for OpenCV
    img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

    # Check if the image is too small (e.g., width < 600px)
    height, width = img_bgr.shape[:2]
    
    if width < 600 or height < 800:
        # Calculate a scale factor to bring it up to an acceptable baseline size (e.g., ~1200px width)
        scale = max(1200 / width, 1600 / height)
        
        # Use bicubic interpolation as a fallback stub for AI upscaling
        # A real implementation would run an inference pass here: model.predict(img_bgr)
        upscaled = cv2.resize(img_bgr, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
        
        # Apply a subtle unsharp mask to recover some edge detail lost in bicubic upscaling
        gaussian = cv2.GaussianBlur(upscaled, (0, 0), 2.0)
        upscaled = cv2.addWeighted(upscaled, 1.5, gaussian, -0.5, 0)
    else:
        upscaled = img_bgr

    # Convert back to RGB for PIL
    final_np = cv2.cvtColor(upscaled, cv2.COLOR_BGR2RGB)
    
    final_pil = Image.fromarray(final_np)
    output = io.BytesIO()
    final_pil.save(output, format="JPEG", quality=100)
    
    return output.getvalue()
