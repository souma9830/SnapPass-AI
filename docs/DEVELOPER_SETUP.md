# SnapPass-AI Developer Setup & Onboarding Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Python >= 3.10
- Docker & Docker Compose (Optional)

## Local Installation Step-by-Step

### 1. Clone Repository
```bash
git clone https://github.com/Babin123456/SnapPass-AI.git
cd SnapPass-AI
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install

# Install Python AI dependencies
cd ../python-ai-service && pip install -r requirements.txt
```

### 3. Environment Setup
Copy `.env.example` to `.env` in `backend/` and `frontend/`:
```bash
cp backend/.env.example backend/.env
```

### 4. Running Dev Servers
```bash
# Terminal 1: Frontend (Vite)
cd frontend && npm run dev

# Terminal 2: Backend (Express)
cd backend && npm run dev
```

## Batch Processing & Queue Architecture
- `useBatchExport` hook supports automated 2-attempt retries for failed zip packages.
- `BatchProcessingQueueModal` displays live queue progress, failed item retries, and item removal controls.

