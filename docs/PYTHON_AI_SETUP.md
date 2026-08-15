# Python AI Service Setup

## Overview

The Python AI service (`python-ai-service/`) is a Flask microservice that handles
image processing tasks: background removal, face detection, DPI optimisation,
and A4 print-sheet generation.

## Quick Start

```bash
cd python-ai-service
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The service runs on `http://localhost:8000` by default.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/remove-bg` | Background removal |
| `POST` | `/face-quality-check` | Face quality gate |
| `POST` | `/generate-sheet` | A4 print sheet generation |
| `POST` | `/compliance/check` | Passport compliance check |
| `POST` | `/compliance/check-batch` | Batch compliance check |
| `POST` | `/compliance/auto-correct` | Auto-correct photo issues |
| `POST` | `/compliance/analyze-lighting` | Biometric facial lighting & shadow analysis |

## Security Notes

- All `file_path` inputs are validated against the upload directory boundary
  via `app/services/path_guard.py`.
- Magic-byte validation ensures only JPEG/PNG/WEBP files are processed.
- The `/compliance/auto-correct` endpoint writes to disk; access is restricted
  to authenticated requests in production deployments.

## Adding a New Preset

1. Add the preset to `app/services/sheet_generator.py` → `PRESETS`
2. Add the preset to `app/services/dpi_optimizer.py` → `PRESETS`
3. Add the preset ratio to `app/services/compliance_inspector.py` → `PRESET_FACE_RATIOS`
4. Update the frontend `data/presets.json` accordingly

## Graceful Degradation

If `rembg` or `opencv-python` are not installed, the service will raise a
clear `RuntimeError` at the point of use rather than crashing at startup.
This allows the Flask app to start and serve health-check requests even when
AI dependencies are missing.
