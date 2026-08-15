# SnapPass-AI Developer Onboarding & Technical Guide

## Local Setup Instructions

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Python >= 3.10 (for backend AI service)

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```

### Running Backend API
```bash
cd backend
npm install
npm start
```

## Project Directory Layout
- `frontend/src/components/`: Reusable React components grouped by feature (analytics, batch, editor, print, security).
- `frontend/src/services/`: Core logic, API communication, and IndexedDB storage engines.
- `frontend/src/types/`: TypeScript interface contracts.
- `frontend/src/utils/`: Pixel math, EXIF binary parsing, and layout calculation helpers.
