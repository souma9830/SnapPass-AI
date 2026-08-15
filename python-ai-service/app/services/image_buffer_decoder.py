"""
image_buffer_decoder.py — Memory Buffer OpenCV Image Decoder
Built for ELUSoC 2026 / GSSOC 2026.
"""
import cv2
import numpy as np

def decode_image_buffer(image_bytes: bytes):
    if not image_bytes:
        return None
    nparr = np.frombuffer(image_bytes, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
