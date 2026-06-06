# SnapPass-AI Architecture & Developer Handbook

Welcome to the SnapPass-AI developer handbook. This document describes the system architecture, component interaction, and deployment model.

## System Topology

SnapPass-AI follows a decoupled three-tier microservice architecture:

```mermaid
graph TD
    A[React Frontend] -->|HTTP/REST| B[Express.js Gateway]
    B -->|HTTP/REST| C[Python AI Service]
    B -->|Mongoose| D[(MongoDB Database)]
    B -->|Redis Client| E[(Redis Cache)]
```

### Components

1. **Frontend (React / Vite)**
   - Located in the `frontend` folder.
   - Responsible for UI rendering, cropping tools, print layouts, and interactive guides.
   - Built with Vanilla CSS/Tailwind, Framer Motion, and Lucide icons.

2. **Backend Gateway (Node.js / Express)**
   - Located in the `backend` folder.
   - Acts as the orchestrator: manages auth (JWT/cookie), file uploads, history records, and proxies requests to the Python AI service.

3. **Python AI Service (FastAPI / OpenCV)**
   - Located in the `python-ai-service` folder.
   - Houses the computer vision logic: blur assessment, face alignment, face bounding box validation, and high-DPI sheet assembly.

---

## Data & File Flows

### Passport Image Processing Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Gateway as Express Gateway
    participant AI as Python AI Service
    participant Cloud as Cloudinary/Storage

    User->>Frontend: Select & Crop Image
    Frontend->>Gateway: POST /api/upload (Multipart Form Data)
    Gateway->>AI: POST /api/process (FastAPI backend)
    AI-->>Gateway: Quality assessment & regions (JSON)
    Gateway->>Cloud: Store processed assets (if configured)
    Gateway-->>Frontend: Return validation report and metadata
```

## Running the Stack Locally

For development, run each service or use the root-level `docker-compose.yml`:

```bash
docker-compose up --build
```
