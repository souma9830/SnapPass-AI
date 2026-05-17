import os
from flask import Flask
from flask_cors import CORS
import config
from app.routes.process_routes import process_bp

app=Flask(__name__)
CORS(app)
os.makedirs(config.UPLOAD_DIR, exist_ok=True)

app.register_blueprint(process_bp)

@app.get("/health")
def health():
    return {"status": "ok", "service": "python-ai-service"}
 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG)