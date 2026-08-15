"""
security_headers.py — Security Headers Flask Decorator
Built for ELUSoC 2026 / GSSOC 2026.
"""
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    return response
