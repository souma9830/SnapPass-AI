# SnapPass AI Backend API Documentation

This file documents the major endpoints, request structures, and JSON responses exposed by the **SnapPass AI Backend API**.

---

## 1. Authentication Endpoints

### Register User
*   **Endpoint**: `POST /api/auth/register`
*   **Payload**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "name": "Jane Doe"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "success": true,
      "token": "JWT_TOKEN_HERE",
      "user": {
        "id": "USER_ID",
        "email": "user@example.com",
        "name": "Jane Doe"
      }
    }
    ```

### Login User
*   **Endpoint**: `POST /api/auth/login`
*   **Payload**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "token": "JWT_TOKEN_HERE"
    }
    ```

---

## 2. Upload & Processing Endpoints

### Upload Photo
*   **Endpoint**: `POST /api/upload`
*   **Headers**: `Content-Type: multipart/form-data`
*   **Payload**: File binary attached under form key `photo`.
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "fileId": "UNIQUE_FILE_IDENTIFIER",
      "url": "/uploads/UNIQUE_FILE_IDENTIFIER.png"
    }
    ```

### Retrieve Uploaded Photo
*   **Endpoint**: `GET /api/upload/:fileId`
*   **Headers**: `Authorization: Bearer JWT_TOKEN_HERE`
*   **Response (200 OK)**: Streams the file binary or returns the path URL details.

### Process Passport Image
*   **Endpoint**: `POST /api/process`
*   **Headers**: 
    *   `Content-Type: application/json`
    *   `Authorization: Bearer JWT_TOKEN_HERE`
*   **Payload**:
    ```json
    {
      "photo_path": "uploads/YOUR_UPLOADED_FILE.png",
      "preset_id": "35x45",
      "quantity": 8,
      "bg_color": [255, 255, 255],
      "draw_guides": true
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "output_path": "outputs/sheet_35x45.jpg",
      "downloadUrl": "/uploads/sheet_35x45.jpg"
    }
    ```

---

---

## 4. Administrative Audit & Telemetry

### Query Audit Logs
* **Endpoint**: `GET /api/admin/audit-logs?page=1&limit=20&method=POST`
* **Headers**: `Authorization: Bearer <ADMIN_JWT>`
* **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "logs": [
          {
            "_id": "60d5ec49f1b2c80015f8e123",
            "method": "POST",
            "endpoint": "/api/photos/upload",
            "statusCode": 200,
            "durationMs": 142,
            "ip": "127.0.0.1",
            "userAgent": "Mozilla/5.0",
            "createdAt": "2026-08-09T18:00:00.000Z"
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 20,
          "total": 1,
          "pages": 1
        }
      }
    }
    ```

### Query Audit Traffic Statistics
* **Endpoint**: `GET /api/admin/audit-stats`
* **Headers**: `Authorization: Bearer <ADMIN_JWT>`
* **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "totalRequests24h": 1250,
        "errorCount24h": 12,
        "errorRate24h": "0.96",
        "methodBreakdown": [{ "_id": "POST", "count": 800 }],
        "topEndpoints": [{ "_id": "/api/photos/upload", "count": 450, "avgDuration": 125.4 }]
      }
    }
    ```

