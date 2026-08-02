from functools import wraps
from flask import request, jsonify

def require_role(allowed_roles):
    """
    Decorator for Role-Based Access Control (RBAC).
    In a full production environment, this would decode a JWT from the 
    Authorization header, fetch the user's organization and role from the DB,
    and verify they have permission to access the endpoint.
    
    Args:
        allowed_roles: A list of strings representing the permitted roles 
                       (e.g., ['admin', 'staff'])
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # For this MVP stub, we extract a mock role from the headers
            user_role = request.headers.get("X-User-Role")
            
            # If RBAC is being enforced by the client (header is present), validate it
            if user_role and user_role not in allowed_roles:
                return jsonify({
                    "success": False, 
                    "error": "Forbidden: You do not have the required role to perform this action."
                }), 403
                
            # Allow the request to proceed (either role matches, or no role header sent for public access)
            return f(*args, **kwargs)
        return decorated_function
    return decorator
