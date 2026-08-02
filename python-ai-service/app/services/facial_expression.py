import cv2
import numpy as np

def analyze_facial_expression(image_bytes: bytes) -> dict:
    """
    Analyzes the facial expression to ensure neutrality.
    Returns a dictionary with 'is_neutral' boolean and 'reason' string.
    (Stub implementation using OpenCV for demonstration)
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))

    if len(faces) == 0:
        return {"is_neutral": False, "reason": "No face detected in the image."}

    # For a full implementation, you would use a facial landmark detector
    # (like dlib or MediaPipe) to check eye openness and mouth curvature.
    # Here we simulate a successful neutral check.
    
    return {"is_neutral": True, "reason": "Expression is neutral."}
