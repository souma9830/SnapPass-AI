# SnapPass-AI API Specifications

## REST API Reference

### 1. Photo Upload Endpoint
`POST /api/photo/upload`

**Headers**:
- `Content-Type: multipart/form-data`

**Request Body**:
- `photo`: File (JPEG, PNG, WebP <= 10MB)
- `sizePreset`: String (`35x45`, `51x51`, `2x2in`)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "filename": "passport_1722748000.jpg",
    "url": "/uploads/passport_1722748000.jpg",
    "dimensions": { "width": 600, "height": 771 }
  }
}
```

### 2. AI Compliance Inspection
`POST /api/compliance/check`

**Request Body**:
```json
{
  "filename": "passport_1722748000.jpg",
  "sizePreset": "35x45"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "headRatio": 0.74,
    "backgroundUniformity": 92,
    "lightingScore": 88,
    "status": "COMPLIANT"
  }
}
```
