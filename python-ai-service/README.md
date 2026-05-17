# Python AI Service

Flask microservice for SnapPass AI — handles all image processing.
Runs on **`http://localhost:8000`**

---

## Quick Start

```bash
cd python-ai-service
pip install -r requirements.txt
python main.py
```

---

## Folder Structure

```
python-ai-service/
├── app/
│   └── services/
│       ├── bg_remove.py        # Background removal
│       ├── face_center.py      # Face detection & centering
│       ├── dpi_optimizer.py    # Resize to passport dimensions
│       └── sheet_generator.py  # A4 sheet layout
├── main.py                     # Flask entry point
└── requirements.txt
```

---

## API Routes

### `GET /health`
Check if the service is up.

```json
// Response
{ "status": "ok" }
```

---

### `POST /generate-sheet`
Generate a print-ready A4 passport photo sheet.

```json
// Request Body
{
    "photo_path"  : "path/to/photo.jpg",  // required
    "preset_id"   : "35x45",              // optional, default: "35x45"
    "quantity"    : 8,                    // optional, default: 8
    "bg_color"    : [255, 255, 255],      // optional, default: white
    "draw_guides" : true                  // optional, default: true
}

// Success → returns JPEG image (200)
// Error   → { "error": "reason here" }
```

**Available Presets**

| ID | Country | Size |
|----|---------|------|
| `35x45` | India / UK | 35 × 45 mm |
| `51x51` | USA Visa | 51 × 51 mm |
| `33x48` | Schengen | 33 × 48 mm |
| `40x60` | China | 40 × 60 mm |
| `2x2in` | US Passport | 2 × 2 in |

---

### `POST /process` *(coming soon)*
Full AI pipeline — background removal → face centering → DPI resize.

---

## Connecting from Node.js Backend

In `backend/.env`:
```
AI_SERVICE_URL=http://localhost:8000
```

Example Axios call:
```javascript
const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/generate-sheet`,
    { photo_path, preset_id, quantity },
    { responseType: "arraybuffer" }
);
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| flask | Web framework |
| flask-cors | Cross-origin requests |
| Pillow | Image processing |
| rembg | AI background removal |
| opencv-python | Face detection |
| numpy | Array operations |
| gunicorn | Production server |
