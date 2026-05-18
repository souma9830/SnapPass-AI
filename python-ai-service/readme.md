# SnapPass AI — Python AI Service

The Python AI microservice for SnapPass AI. Built with Flask, it handles all image processing tasks — background removal, face centering, DPI optimisation, and A4 sheet generation.

Runs on `http://localhost:8000` and is called by the Express backend.

---

## Prerequisites

- Python 3.9 or higher *(3.9 preferred)*

---

## Local Setup

### 1. Navigate to the service folder

```bash
cd python-ai-service
```

### 2.Create and activate a virtual environment

```bash
# Create
python3.9 -m venv venv

# Activate — Mac/Linux
source venv/bin/activate

# Activate — Windows
venv\Scripts\activate
```

### 3.Install dependencies

```bash
pip install -r requirements.txt
```

### 4.Create your `.env` file

```env
PORT=8000
FLASK_DEBUG=true
UPLOAD_DIR=uploads
MAX_FILE_MB=10
```

### 5.Start the service

```bash
python main.py
```

Service will be running at `http://localhost:8000`

---

## API Endpoints

### `GET /health`

Check if the service is running.

**Response:**
```json
{
  "status": "ok",
  "service": "python-ai-service"
}
```

---

### `POST /remove-bg`

Removes the background from a portrait photo and replaces it with a solid colour.

**Request — `multipart/form-data`:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File |  Yes | Portrait photo (JPEG, PNG, WEBP) |
| `background_colour` | Text |  No | Colour name or hex. Default: `white` |

**Supported `background_colour` values:**

| Value | Description |
|-------|-------------|
| `white` | Pure white — most passport standards |
| `off-white` | Slightly warm white |
| `blue` | Passport blue |
| `grey` / `gray` | Light grey |
| `#ffffff` | Any custom hex colour code |

**Success Response — `200 OK`:**

Returns the processed image directly as `image/png` bytes.

**Error Responses:**

| Status | Reason |
|--------|--------|
| `400` | No image file provided or empty filename |
| `422` | Unsupported background colour value |
| `500` | Internal processing error |

---

## 🔌 Backend Integration Guide

This section explains how the Express backend (`image.controller.js`) should call this service.

### How it works

```
React Frontend
     ↓  POST /api/process
Express Backend (port 5000)
     ↓  POST /remove-bg
Python AI Service (port 8000)
     ↓  returns PNG bytes
Express Backend
     ↓  returns image to frontend
React Frontend
```

### Express → Python service call

In `backend/src/controllers/image.controller.js`:

```javascript
const axios    = require("axios");
const FormData = require("form-data");
const fs       = require("fs");

const form = new FormData();
form.append("image", fs.createReadStream(filePath));
form.append("background_colour", backgroundColour); // e.g. "white"

const aiResponse = await axios.post(
  `${config.aiServiceUrl}/remove-bg`,
  form,
  {
    headers: { ...form.getHeaders() },
    responseType: "arraybuffer", // important — response is PNG bytes
  }
);

// Send PNG back to frontend
res.set("Content-Type", "image/png");
res.send(Buffer.from(aiResponse.data));
```

### Environment variable

Make sure this is set in `backend/.env`:

```env
AI_SERVICE_URL=http://localhost:8000
```

This maps to `config.aiServiceUrl` in `backend/src/config/app.config.js`.

---

## Testing the Service

### Using Postman

1.Method: `POST`
2.URL: `http://localhost:8000/remove-bg`
3.Body → `form-data`
4.Add field: `image` → type `File` → select your photo
5.Add field: `background_colour` → type `Text` → `white`
6.Click **Send**

You will receive the background-removed PNG directly in the response.

---

## Folder Structure

```
python-ai-service/
├── main.py                        # Flask app entry point — runs on port 8000
├── config.py                      # Reads .env variables
├── requirements.txt               # Python dependencies
├── .env                           # Local environment variables (not committed)
├── .gitignore                     # venv, uploads, .env excluded
└── app/
    ├── routes/
    │   └── process_routes.py      # All Flask endpoint definitions
    └── services/
        ├── bg_remove.py           # Background removal using rembg
        ├── face_center.py         # Face detection using OpenCV
        ├── dpi_optimizer.py       # DPI resize using Pillow
        └── sheet_generator.py     # A4 sheet tiling using Pillow
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `flask` | Web framework — serves the API endpoints |
| `flask-cors` | Allows cross-origin requests from the React frontend |
| `rembg` | AI-powered background removal using U2Net model |
| `Pillow` | Image compositing, resizing, and DPI handling |
| `opencv-python-headless` | Face detection using Haar cascade |
| `python-dotenv` | Loads `.env` variables into `config.py` |

---

## Common Errors

**`rembg` first run is slow:**
The first request downloads the U2Net model (~170MB). Subsequent requests are fast.

**`ECONNREFUSED` in Express:**
The Python service is not running. Start it with `python main.py` before running the backend.

**`venv` not activating on Windows:**
Run this in PowerShell first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Contributing

Want to implement the remaining services? Check the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

**Remaining high priority tasks:**
- `face_center.py` — face detection and auto-centering using OpenCV
- `dpi_optimizer.py` — resize to passport dimensions at 300 DPI
- `sheet_generator.py` — tile photos onto A4 print sheet