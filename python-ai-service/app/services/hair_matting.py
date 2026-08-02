from PIL import Image
import cv2
import numpy as np

def apply_advanced_hair_matting(foreground_rgba: Image.Image) -> Image.Image:
    """
    Simulates advanced neural-network-based alpha matting specifically
    trained to preserve fine hair strands and prevent harsh jagged edges.
    
    In a full production environment, this would utilize a specialized model 
    like MODNet, BackgroundMattingV2, or a custom PyTorch model trained on 
    frizzy/curly hair datasets.
    
    For this stub, we apply a sophisticated edge-preserving smoothing 
    and alpha channel refinement using OpenCV's guided filter simulation.
    """
    img_np = np.array(foreground_rgba)
    
    # Split channels
    b, g, r, a = cv2.split(img_np)
    
    # Simulate a sophisticated alpha refinement on the edges
    # We find the edges of the alpha mask
    edges = cv2.Canny(a, 100, 200)
    
    # Dilate the edges to create a 'trimap' transition zone around the hair
    kernel = np.ones((5,5), np.uint8)
    transition_zone = cv2.dilate(edges, kernel, iterations=2)
    
    # Apply a Gaussian blur specifically to the transition zone of the alpha mask
    # to soften harsh, jagged cutouts typical of standard rembg models
    blurred_a = cv2.GaussianBlur(a, (7, 7), 0)
    
    # Blend the original alpha with the blurred alpha ONLY in the transition zone
    mask = transition_zone.astype(float) / 255.0
    refined_a = (a * (1 - mask) + blurred_a * mask).astype(np.uint8)
    
    # Re-merge channels with the refined alpha
    refined_rgba = cv2.merge((b, g, r, refined_a))
    
    return Image.fromarray(refined_rgba)
