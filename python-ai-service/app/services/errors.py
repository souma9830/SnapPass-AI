class ImageProcessingError(Exception):
    """Base exception for image operations failures."""
    pass

class FaceNotFoundError(ImageProcessingError):
    """Raised when face detector finds 0 faces."""
    pass
