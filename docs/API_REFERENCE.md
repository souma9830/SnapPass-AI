# 📡 SnapPass-AI API Reference

## 🔐 Authentication Endpoints (`/api/auth`)
- `POST /api/auth/signup`: Register new user account.
- `POST /api/auth/signin`: Authenticate user and issue JWT cookie.
- `POST /api/auth/logout`: Revoke active session token.

---

## 📷 Processing Endpoints (`/api/process`)
- `POST /api/upload`: Upload portrait photo (multipart/form-data). Max 10MB.
- `POST /api/compliance/check`: Evaluate photo compliance against country standards (e.g. `35x45`, `51x51`).
- `POST /api/print/generate-sheet`: Generate downloadable print sheet.

---

## 🤖 Python AI Microservice Endpoints (`http://localhost:8000`)
- `POST /process-image`: Removes background and centers face.
- `POST /check-compliance`: Runs face quality gate, blur score, and tilt inspection.
- `POST /generate-sheet`: Renders A4/4x6 print sheet grid with crop marks.
