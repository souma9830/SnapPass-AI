import os
import sys

def validate_environment():
    # Verify environment values
    port_str = os.getenv("PORT", "8000")
    try:
        port = int(port_str)
        if port <= 1024 or port > 65535:
            raise ValueError
    except ValueError:
        print(f"❌ CRITICAL CONFIG ERROR: Invalid PORT environment variable '{port_str}'. Must be an integer between 1025 and 65535.", file=sys.stderr)
        sys.exit(1)

    max_file_mb = os.getenv("MAX_FILE_MB", "10")
    try:
        val = int(max_file_mb)
        if val <= 0:
            raise ValueError
    except ValueError:
        print(f"❌ CRITICAL CONFIG ERROR: Invalid MAX_FILE_MB '{max_file_mb}'. Must be a positive integer.", file=sys.stderr)
        sys.exit(1)

    print("✅ SnapPass AI Python Service environment variables validated.")
