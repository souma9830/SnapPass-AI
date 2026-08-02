import cv2
import numpy as np

def apply_subtle_retouch(image_bytes: bytes) -> bytes:
    """
    Applies a very subtle bilateral filter to the image to slightly smooth out 
    temporary skin blemishes (like minor acne or redness) while strictly 
    preserving edges, moles, scars, and facial structure to remain compliant 
    with ID photo regulations.
    """
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    if img is None:
        return image_bytes
        
    # Bilateral filter is highly effective at noise removal/skin smoothing 
    # while preserving sharp edges.
    # d=9, sigmaColor=30, sigmaSpace=30 keeps the effect very minimal/subtle.
    retouched = cv2.bilateralFilter(img, d=9, sigmaColor=30, sigmaSpace=30)
    
    # Encode back to bytes
    success, encoded_image = cv2.imencode('.jpg', retouched, [cv2.IMWRITE_JPEG_QUALITY, 95])
    if not success:
        return image_bytes
        
    return encoded_image.tobytes()
