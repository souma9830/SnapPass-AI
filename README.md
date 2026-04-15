<div align="center">

<h1>📷 SnapPass AI</h1>

<p><strong>Open-source AI-powered passport photo studio</strong><br/>
Upload → Auto-process → Generate a print-ready sheet — in seconds.</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/souma9830/SnapPass-AI)
[![Made with React](https://img.shields.io/badge/Frontend-React.js-61dafb?logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org)
[![Python](https://img.shields.io/badge/AI%20Service-Python-3776ab?logo=python)](https://python.org)

</div>

---

## 📌 What is SnapPass AI?

**SnapPass AI** is a free, open-source web application that lets anyone generate professional passport-quality photos from any selfie or portrait.

No expensive studio. No complicated software. Just upload, click, and print.

### ✨ What it does

| Step | Description |
|------|-------------|
| 📤 **Upload** | Drag & drop or browse any portrait photo |
| 🧠 **AI Process** | Background removal, face centering, DPI optimisation |
| 📐 **Customise** | Choose country standard (India, USA, UK, Schengen…) |
| 🖨️ **Print** | Download a print-ready A4 sheet with multiple photos |

---

## 🧭 Project Status

> ⚠️ **This project is in active early development.** The frontend scaffold is complete and functional. The backend and Python AI service stubs are ready for contributors to build on.

| Layer | Status |
|-------|--------|
| Frontend (React) | ✅ Scaffold complete — fully navigable |
| Backend (Express) | 🟡 Scaffold ready — needs controller logic |
| Python AI Service | 🟡 Structure ready — needs OpenCV / rembg logic |
| Database (MongoDB) | 🔲 Structure planned — not yet implemented |

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, React Router DOM, Vanilla CSS |
| **Backend** | Node.js, Express.js, Multer |
| **AI Microservice** | Python, Flask, OpenCV, Pillow, rembg |
| **Database** *(planned)* | MongoDB |

---

## 📁 Folder Structure

```
snappass-ai/
│
├── frontend/                   # React.js web app
│   └── src/
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.js          # Top navigation bar
│       │   │   └── Footer.js          # Site footer
│       │   ├── UploadBox.js           # Drag-and-drop upload
│       │   ├── PhotoPreview.js        # Before/after photo viewer
│       │   ├── BackgroundSelector.js  # BG colour picker
│       │   ├── SizeSelector.js        # Country preset dropdown
│       │   ├── QuantityInput.js       # Number of photos stepper
│       │   ├── PrintButton.js         # Download/print CTA
│       │   └── LoadingSpinner.js      # Reusable spinner
│       ├── pages/
│       │   ├── HomePage.js            # Landing page
│       │   ├── UploadPage.js          # Step 1 — upload
│       │   ├── EditorPage.js          # Step 2 — AI editor
│       │   ├── PrintPreviewPage.js    # Step 3 — preview & print
│       │   └── AdminDashboard.js      # Admin panel
│       ├── hooks/
│       │   ├── usePhotoUpload.js      # Upload state management
│       │   └── useImageProcessor.js   # AI processing state
│       ├── services/
│       │   ├── api.js                 # Axios base instance
│       │   └── photoService.js        # All photo API calls
│       ├── utils/
│       │   ├── fileValidation.js      # Client-side validation
│       │   └── formatters.js          # String/number formatting
│       └── routes/
│           └── AppRoutes.js           # Central route config
│
├── backend/                    # Express.js REST API
│   └── src/
│       ├── config/app.config.js
│       ├── controllers/
│       │   ├── upload.controller.js
│       │   ├── image.controller.js
│       │   └── print.controller.js
│       ├── routes/
│       │   ├── upload.routes.js
│       │   ├── image.routes.js
│       │   └── print.routes.js
│       └── middlewares/
│           ├── upload.middleware.js
│           ├── error.middleware.js
│           └── validate.middleware.js
│
└── python-ai-service/          # Python Flask AI microservice
    ├── app/
    │   └── services/
    │       ├── bg_remove.py           # rembg background removal
    │       ├── face_center.py         # OpenCV face detection
    │       ├── dpi_optimizer.py       # DPI resize logic
    │       └── sheet_generator.py     # A4 sheet layout
    └── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [Python](https://python.org/) 3.9 or higher
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/souma9830/SnapPass-AI.git
cd SnapPass-AI
```

---

### 2. Run the Frontend

```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 3. Run the Backend *(optional — not fully implemented yet)*

```bash
cd backend
npm install
npm run dev
```

Backend runs at [http://localhost:5000](http://localhost:5000).

Health check: `GET http://localhost:5000/health`

---

### 4. Run the Python AI Service *(optional — not fully implemented yet)*

```bash
cd python-ai-service
pip install -r requirements.txt
python main.py
```

AI service runs at [http://localhost:8000](http://localhost:8000).

---

## 🗺️ App Flow (UI)

```
Home
  └── /upload         (Upload your photo)
        └── /editor   (Choose background + size → AI process)
              └── /print-preview  (Set quantity → Download A4 sheet)
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload photo |
| `GET`  | `/api/upload/:id` | Get upload metadata |
| `POST` | `/api/process` | AI process photo |
| `GET`  | `/api/process/preview/:filename` | Get processed preview |
| `POST` | `/api/print/generate-sheet` | Generate A4 print sheet |
| `GET`  | `/api/print/presets` | List size presets |
| `GET`  | `/health` | Backend health check |

---

## 🌍 Supported Passport Photo Sizes

| Preset ID | Standard | Dimensions |
|-----------|----------|------------|
| `35x45` | India / UK Passport | 35 × 45 mm |
| `51x51` | USA Visa | 51 × 51 mm |
| `33x48` | Schengen Visa | 33 × 48 mm |
| `40x60` | China Visa | 40 × 60 mm |
| `2x2in` | US Passport | 2 × 2 inches |

---

## 🔧 Environment Variables

### Frontend (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
AI_SERVICE_URL=http://localhost:8000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:3000
```

---

## 🛣️ Roadmap

### Phase 1 — Foundation ✅
- [x] React frontend scaffold with all pages & components
- [x] Express backend scaffold with all routes & controllers
- [x] Python AI service structure

### Phase 2 — Core Features 🚧 *(contributors needed!)*
- [ ] Background removal using `rembg`
- [ ] Face detection & auto-centering using OpenCV
- [ ] DPI optimisation & resize to standard dimensions
- [ ] A4 print sheet generation using Pillow

### Phase 3 — Enhancements 🔲
- [ ] MongoDB database integration
- [ ] User session & upload history
- [ ] Real-time image preview after AI processing
- [ ] Admin dashboard with live statistics
- [ ] Multi-file batch upload support

### Phase 4 — Production 🔲
- [ ] Docker Compose setup
- [ ] CI/CD pipeline
- [ ] Deploy guide (Vercel + Render + Railway)
- [ ] PWA support
- [ ] Dark mode

---

## 🤝 Contributing

We ❤️ contributions! Whether you're fixing bugs, building features, improving docs, or designing UI elements — every contribution matters.

👉 **Read the full guide:** [CONTRIBUTING.md](CONTRIBUTING.md)

**Quick summary:**

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Open a Pull Request to `master`

---

## 🏷️ Good First Issues

New to open source? Look for issues tagged:

- `good first issue` — small, well-defined tasks
- `help wanted` — features awaiting a contributor
- `documentation` — improve docs and comments

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

You are free to use, modify, and distribute this project for both personal and commercial use.

---

## 👨‍💻 Project Admin

**Soumadeep** — [@souma9830](https://github.com/souma9830)

---

<div align="center">

**⭐ If you find this useful, please star the repository — it helps others discover the project!**

[⭐ Star on GitHub](https://github.com/souma9830/SnapPass-AI) · [🐞 Report a Bug](https://github.com/souma9830/SnapPass-AI/issues/new?template=bug_report.md) · [💡 Request a Feature](https://github.com/souma9830/SnapPass-AI/issues/new?template=feature_request.md)

</div>
