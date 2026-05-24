

import cv2
import numpy as np
from PIL import Image
import io


#ICAO 9303 guideline:face should occupy 75 % of the image height
FACE_HEIGHT_RATIO = 0.75

#How far above the top of the detected face to place the top of the crop
#(to include forehead + a small margin above hair)
HEAD_TOP_PADDING_RATIO=0.20


def center_face(image_bytes: bytes) -> bytes:
    
    img_pil = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    img_np = np.array(img_pil)

    # OpenCV works with BGR; use the RGB channels for detection
    img_bgr = cv2.cvtColor(img_np[:, :, :3], cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)

    face_rect = _detect_face(gray)
    if face_rect is None:
        raise ValueError(
            "No face detected in the image. "
            "Please use a clear front-facing portrait photo."
        )

    fx, fy, fw, fh= face_rect
    face_cx= fx + fw // 2  # horizontal centre of face
    face_top= fy           # top of bounding box (eyebrows area)

    # --- Compute the target canvas height from the face height ---
    # FACE_HEIGHT_RATIO tells us: fh / target_h = FACE_HEIGHT_RATIO
    target_h= int(fh / FACE_HEIGHT_RATIO)
    target_w= img_pil.width  # keep original width initially

    # How much space above the face-top we want (forehead + hair room)
    head_clearance= int(HEAD_TOP_PADDING_RATIO * target_h)

    # The y-coordinate in the original image that maps to y=0 in the crop
    crop_top= face_top - head_clearance
    crop_bottom= crop_top + target_h

    # Centre horizontally around the face centre
    crop_left= face_cx - target_w // 2
    crop_right= crop_left + target_w

    # --- Pad if the crop extends beyond the original image ---
    pad_top= max(0, -crop_top)
    pad_bottom= max(0, crop_bottom - img_pil.height)
    pad_left= max(0, -crop_left)
    pad_right= max(0, crop_right - img_pil.width)

    # Expand canvas with transparent padding then crop
    padded = Image.new(
        "RGBA",
        (img_pil.width + pad_left + pad_right, img_pil.height + pad_top + pad_bottom),
        (255, 255, 255, 255),
    )
    padded.paste(img_pil, (pad_left, pad_top))

    # Re-calculate crop coords in the padded image
    c_top= crop_top    + pad_top
    c_left= crop_left   + pad_left
    c_bottom= c_top  + target_h
    c_right= c_left + target_w

    cropped= padded.crop((c_left, c_top, c_right, c_bottom))

    output = io.BytesIO()
    cropped.save(output, format="PNG")
    return output.getvalue()



# Helpers
def _detect_face(gray_image: np.ndarray):
    """
    Run OpenCV Haar cascade on a grayscale image.
    Returns (x, y, w, h) of the largest detected face, or None.
    """
    cascade= cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = cascade.detectMultiScale(
        gray_image,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(60, 60),
    )

    if len(faces)== 0:
        return None

    # Pick the largest face by area
    largest= max(faces, key=lambda r: r[2] * r[3])
    return largest