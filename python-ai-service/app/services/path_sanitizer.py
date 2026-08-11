"""
path_sanitizer.py — Path Traversal Security Sanitizer for Python Microservice
Built for ELUSoC 2026 / GSSOC 2026.
"""
import os

ALLOWED_UPLOAD_DIRS = [
    os.path.abspath("uploads"),
    os.path.abspath("temp"),
    os.path.abspath("/tmp"),
]

def sanitize_file_path(input_path: str, allowed_dirs=None) -> str:
    if not input_path:
        raise ValueError("File path cannot be empty")
    
    if allowed_dirs is None:
        allowed_dirs = ALLOWED_UPLOAD_DIRS

    resolved_path = os.path.abspath(input_path)
    
    is_safe = any(resolved_path.startswith(d) for d in allowed_dirs)
    if not is_safe:
        raise PermissionError(f"Access denied: path '{input_path}' is outside designated sandbox directories.")
        
    return resolved_path
