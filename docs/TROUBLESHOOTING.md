# SnapPass-AI Troubleshooting Handbook

This guide outlines common issues encountered during the installation, configuration, and execution of the SnapPass-AI microservice ecosystem (Frontend, Express Backend, and Python AI Service) and provides tested steps for resolution.

---

## 1. Database Connection and Mongoose Failures

### Symptom: `MONGO_URI is not defined in environment variables`
* **Reason**: The backend server was started without a properly loaded `.env` file containing the MongoDB connection URI string.
* **Resolution**:
  1. Copy `backend/.env.example` to `backend/.env`.
  2. Populate `MONGO_URI` with your connection string (e.g., `mongodb://localhost:27017/snappass` or a MongoDB Atlas URI).
  3. Ensure no trailing spaces or quotes surround the URI.

### Symptom: Mongoose Connection Timeout / Connection Retry Exceeded
* **Reason**: Local MongoDB service is either not running or blocked by firewalls.
* **Resolution**:
  - **Windows**: Run `net start MongoDB` or check Services manager to ensure the service is running.
  - **Linux/macOS**: Run `sudo systemctl status mongod` or `brew services list`.
  - Check that the host IP address is whitelisted in your Atlas Network Access tab if using MongoDB Atlas.

---

## 2. Python AI Service & OpenCV Library Issues

### Symptom: `ImportError: libGL.so.1: cannot open shared object file: No such file or directory`
* **Reason**: The Python AI service uses OpenCV, which depends on OpenGL and other system graphics libraries that are missing in minimal server or Docker base images.
* **Resolution**:
  - **Ubuntu/Debian / Docker host**: Install `libgl1-mesa-glx` and `libglib2.0-0`:
    ```bash
    sudo apt-get update && sudo apt-get install -y libgl1-mesa-glx libglib2.0-0
    ```
  - **Alpine Linux / Minimal Docker**: Replace `opencv-python` with `opencv-python-headless` in your `requirements.txt` to avoid binding to X-server windowing libraries.

### Symptom: `ModuleNotFoundError: No module named 'flask'`
* **Reason**: Virtual environment is inactive or dependencies are not installed.
* **Resolution**:
  1. Create and activate a virtual environment:
     ```bash
     python -m venv venv
     # Windows:
     .\venv\Scripts\activate
     # macOS/Linux:
     source venv/bin/activate
     ```
  2. Install all requirements:
     ```bash
     pip install -r requirements.txt
     ```

---

## 3. Docker & Docker Compose Failures

### Symptom: `port is already allocated` or `bind: address already in use`
* **Reason**: Another service is running on backend port `3000` or Python service port `8000` on your host.
* **Resolution**:
  1. Identify the blocking process:
     - **Windows**: `netstat -ano | findstr :3000`
     - **Unix**: `lsof -i :3000`
  2. Terminate the process or update target ports in `docker-compose.yml` to map to alternative host ports.

### Symptom: `connection refused` between backend container and Python service
* **Reason**: The backend container is attempting to reach `http://localhost:8000`, which refers to the inside of its own container rather than the Python service container.
* **Resolution**:
  - Update `AI_SERVICE_URL` in the backend configuration or `.env` to point to the docker container service name (e.g., `http://python-ai-service:8000`).

---

## 4. Frontend Compilation & API Integration

### Symptom: API Calls Fail with `Blocked by CORS policy`
* **Reason**: Frontend origin is not whitelisted by the backend server.
* **Resolution**:
  - Inspect backend's `.env` config file and ensure `CORS_ORIGIN` matches the protocol and port of the frontend client (e.g., `http://localhost:5173`). Avoid trailing slashes.

---

## 5. Environment Variable Configuration Problems

SnapPass-AI is split into three services, each with its own `.env.example` file. Copy each example to its own `.env` file:

| Service | Example file | In your setup |
|---|---|---|
| Frontend (Vite) | `frontend/.env.example` | `frontend/.env` |
| Backend (Express) | `backend/.env.example` | `backend/.env` |
| Python AI service | `python-ai-service/.env.example` | `python-ai-service/.env` |

### Symptom: `JWT_SECRET is not defined` / auth endpoints return 500
* **Reason**: `JWT_SECRET` is required for authentication endpoints and is empty by default.
* **Resolution**: Set a strong random value, e.g. `openssl rand -hex 32`, and keep it stable across restarts so existing tokens stay valid.

### Symptom: Frontend calls work, but `VITE_` variables appear as `undefined`
* **Reason**: Vite only exposes variables prefixed with `VITE_` to the browser bundle. A variable named `API_URL` (without the prefix) is never inlined.
* **Resolution**: Rename the variable to `VITE_API_URL` in `frontend/.env` and restart the dev server (`npm run dev`) — Vite reads `.env` at boot, not per request.

### Symptom: Backend works locally but the AI endpoints fail in production
* **Reason**: `AI_SERVICE_URL` points at `http://localhost:8000`, which is the wrong address inside a container or on another host.
* **Resolution**:
  - Docker Compose: use the service name, e.g. `AI_SERVICE_URL=http://python-ai-service:8000`.
  - Separate hosts: use the deployed URL of the Python service (e.g. a Render/Railway service URL).

### Symptom: Every request to a non-AI endpoint also fails / slow first response
* **Reason**: `MAX_FILE_SIZE` set far above the 10MB default can make the body parser buffer large payloads, and `BCRYPT_SALT_ROUNDS > 12` slows every login noticeably.
* **Resolution**: Keep `MAX_FILE_SIZE=10485760` unless you need larger uploads, and leave `BCRYPT_SALT_ROUNDS=12` (each extra round doubles hashing time).

### Symptom: Caching behaves inconsistently between environments
* **Reason**: `REDIS_URL` is optional — without it the app silently falls back to in-memory caching, which resets on restart and is not shared across instances.
* **Resolution**: Set `REDIS_URL` in any multi-instance deployment; run a single instance if you rely on the in-memory fallback.

---

## 6. Dependency & Version Compatibility

| Component | Supported |
|---|---|
| Node.js | 18+ (Node 20 LTS recommended) |
| npm | 9+ |
| Python | 3.10+ (3.11 recommended) |
| MongoDB | 5.0+ (Atlas or local) |
| Express | ^4.18.2 |
| Mongoose | ^8.x |
| React | ^19.x |
| opencv-python | 4.8+ (`4.8.1.78` pinned in requirements) |

### Symptom: `npm install` fails on a legacy Node version
* **Reason**: Recent Express/Mongoose transitive packages require Node 18+.
* **Resolution**: Install Node 20 LTS (e.g. via `nvm`/`fnm`) and re-run `npm install` in both `backend/` and `frontend/`.

### Symptom: `opencv-python` fails to install on macOS ARM (M1/M2/M3)
* **Reason**: Some older opencv wheels are not compatible with arm64 builds.
* **Resolution**: Force the pinned version `opencv-python==4.8.1.78` (has arm64 wheels) or switch to `opencv-python-headless` when you only need server-side processing.

### Symptom: `rembg` import error or CPU-only model download stalls
* **Reason**: `rembg==2.0.55` downloads its model (`u2net.onnx`) on first use; corporate proxies or firewalls can block the download.
* **Resolution**: Pre-download the model, or set `U2NET_HOME` to a writable directory before first inference; on air-gapped networks, copy the `.onnx` model into that directory manually.

### Symptom: Two versions of a package after pulling latest code
* **Reason**: `package-lock.json` drifted from `package.json`.
* **Resolution**: Run `npm ci` (installs exactly the locked versions) instead of `npm install`, then commit any lockfile changes.

---

## 7. Build & Deployment Issues

### Symptom: `vite build` fails with out-of-memory on low-RAM servers
* **Resolution**:
  ```bash
  NODE_OPTIONS=--max-old-space-size=2048 npm run build
  ```
  or increase swap on the build machine. If the build is flaky, build in CI and upload artefacts instead of building on the server.

### Symptom: Frontend builds fine but the API base URL is wrong in production
* **Reason**: `VITE_API_URL` was set after the build ran — Vite inlines env vars at build time.
* **Resolution**: Rebuild with the production value: `VITE_API_URL=https://api.example.com npm run build`.

### Symptom: Docker build fails on `pip install opencv-python` or `opencv-python==4.8.1.78` not found
* **Reason**: The base image lacks build tooling, or the mirror is stale.
* **Resolution**: Prefer a Python 3.11-slim base and run `pip install --upgrade pip` before `pip install -r requirements.txt`; use `opencv-python-headless` in server-only images.

### Symptom: `Heads up! Future versions of Vite require Node 20+` warning during build
* **Resolution**: Upgrade to Node 20 LTS — the warning is non-fatal in most Vite 5/6 projects, but upcoming major versions will refuse to run on older Node.

### Symptom: Hosted frontend shows `502` on API calls
* **Reason**: The backend or Python service is not reachable from the browser (separate origins without CORS, or a dead dyno/instance).
* **Resolution**: Confirm CORS (`CORS_ORIGIN` = the exact frontend origin), confirm both services are running, and verify `AI_SERVICE_URL` from the backend host, not from your laptop.

---

## 8. Frequently Asked Questions (FAQ)

**Q: Does the app work without MongoDB?**
A: Yes — `MONGO_URI` is optional. The backend runs in a UI-only mode with in-memory storage, which is useful for demos. Data resets on restart.

**Q: Do I need a GPU for the AI service?**
A: No. All processing (open-cv based background removal, red-eye correction, retouching, etc.) runs on CPU. A GPU only speeds up batch processing.

**Q: Why is the first AI request slow?**
A: The first request downloads the segmentation model (`u2net.onnx`, ~170 MB) and initialises the inference engine. Subsequent requests are fast. Pre-download the model to avoid first-request stalls in production.

**Q: How do I report an AI-processing bug?**
A: Include the original image, the exact service call (`/process-photo`, `/remove-background`, etc.), and the response JSON. Never share sensitive documents in public issues.

**Q: Are photos uploaded to the server stored permanently?**
A: Uploaded files go to `UPLOAD_DIR` (default `uploads/`) and are cleaned up as configured; credentials like Cloudinary are optional and fall back to local storage when unset. See `docs/SECURITY_COMPLIANCE_MATRIX.md` for retention details.

**Q: Why do compiled images lose the background after editing?**
A: Processing steps run server-side; if the backend couldn't reach the Python service (`connection refused`), the UI may show the original image. Check `AI_SERVICE_URL` and the Python service logs.

**Q: How do I enable email notifications?**
A: Set `RESEND_API_KEY` and `EMAIL_FROM` in `backend/.env`. Without them, email features degrade gracefully and the rest of the app keeps working.

**Q: Can I run the frontend against a deployed backend in development?**
A: Yes — set `VITE_API_URL` to the deployed backend URL in `frontend/.env` and restart the Vite dev server. Ensure `CORS_ORIGIN` on the backend includes your dev origin.

**Q: Where are API keys stored? Are they exposed to the browser?**
A: Backend keys (`RESEND_API_KEY`, `CLOUDINARY_API_SECRET`, `JWT_SECRET`) live only in `backend/.env` and are never exposed to the client. Browser-facing variables must be prefixed with `VITE_`.

**Q: Why does `docker compose up` fail with a port conflict?**
A: Another process is using `3000`/`8000`. Find it with `lsof -i :3000` (Unix) or `netstat -ano | findstr :3000` (Windows), or remap the ports in `docker-compose.yml`.

**Q: What Python version should I use?**
A: 3.10–3.11. Python 3.13+ may not have wheels for all pinned versions (`numpy==1.26.2`, `opencv-python==4.8.1.78`).

---

## Related Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [API Reference](API_REFERENCE.md)
- [Developer Setup](DEVELOPER_SETUP.md)
- [Python AI Setup](PYTHON_AI_SETUP.md)
- [Enterprise Deployment & Hardening](ENTERPRISE_DEPLOYMENT_HARDENING.md)
- [Documentation for contributors](CONTRIBUTOR_CHECKLIST.md)
