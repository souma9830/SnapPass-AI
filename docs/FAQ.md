# SnapPass FAQ

Answers to the most common questions about setting up, running, testing, and deploying SnapPass. For step-by-step failure fixes, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

## Project basics

### What is SnapPass?
SnapPass is an AI-powered passport-photo studio web app. It runs a React frontend, a Node/Express backend, and a Python AI microservice (`ai-server`) that performs image processing (background removal, upscaling, shadow correction, and more).

### What are the minimum requirements?
- Node.js 18+ (LTS recommended) and npm
- Python 3.10+ with `venv` support
- Git
- A Firebase project (for auth/firestore in production) — optional for local UI-only work
- ~2 GB free disk space for AI model downloads

### What does the repo look like?
```
├── frontend/         React/Vite web app
├── backend/          Node/Express API + middleware
├── python-ai-service/  Python AI microservice (FastAPI)
├── docs/             Guides, API references, troubleshooting
└── README.md
```

## Setup

### `npm install` fails with dependency errors
Delete `node_modules`/`package-lock.json` and reinstall: `rm -rf node_modules package-lock.json && npm install`. If a native module needs build tools, install the Xcode Command Line Tools (`xcode-select --install` on macOS) or `build-essential` on Linux.

### The Python AI service won't start
It runs in a virtual environment. Inside `python-ai-service/`:
```bash
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
If model download fails on first run (network/proxy), pre-download the model or set the model cache directory, then retry.

### Environment variables are not loading
- A `.env` file must exist at the repo root (never commit it).
- All required variables must be defined and spelled exactly as documented in the README.
- Restart the dev server after editing `.env` — most loaders read it once at boot.

## Running

### How do I run the whole stack locally?
1. `npm install` at the repo root
2. Backend: `npm run dev` in `backend/` (default port 5000)
3. Frontend: `npm run dev` in `frontend/` (default port 5174, Vite proxy forwards API calls to the backend)
4. AI service: see the Python setup above (`http://localhost:8000`)

### How do I run only the frontend?
The frontend works standalone for UI work, but image and compliance features call the backend/AI service and will show errors without them.

### Ports are already in use
Default ports: frontend `5174`, backend `5000`, AI service `8000`. Change the port via env/config, or kill the stale process (`lsof -i :5000` → `kill <pid>`).

## Testing

### How do I run tests?
- Backend: `npm test` in `backend/` (Jest + Supertest)
- Frontend: `npm test` in `frontend/`
- AI service: `pytest` in `python-ai-service/`

### A test passes locally but fails in CI
Check the CI node/Python version against your local one, ensure fixtures are committed (never generated), and confirm env vars/secrets used by the test are defined for the CI provider.

## Common errors

### "Cannot find module '@x/y'"
The workspace isn't installed: run `npm install` at the repo root. If a package was added recently, reinstall.

### The backend returns 401/403 for supported calls
The API is auth-gated via config (`REQUIRE_AUTH_FOR_UPLOADS`). When enabled, include a valid session token; when disabled, unauthenticated requests to protected routes are still rejected — use the documented auth path or set the flag per the README.

### The AI service responds 500 on image endpoints
Usually one of: model files not downloaded, unsupported input format, or an uncaught OpenCV/rembg error. Check the `python-ai-service` logs and the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) entry for image processing errors.

### Vercel deploys succeed but the page is blank
Confirm the frontend build output directory and the runtime environment variables match the Vercel project settings.

## Deployment

### How do I deploy?
The frontend deploys to Vercel; the backend and AI service can be deployed to any Node/Python host. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) and set all secrets in the host's environment — never in the repo.

### Can I run everything on one server?
Yes: serve the built frontend statically from the backend, run `ai-server` on a loopback port, and point the backend's AI base URL at it.

## Contributing

### How do I report a bug or ask a feature?
Open a GitHub issue with reproduction steps, expected vs actual behavior, and relevant logs (see [CONTRIBUTING.md](../CONTRIBUTING.md)).

### How do I open a PR?
Fork the repo, create a branch, make focused changes, run the relevant tests, and open the PR against the default branch. Keep `docs/` changes in lockstep with behavior changes.