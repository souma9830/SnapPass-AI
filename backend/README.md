#  SnapPass AI — Backend

The Express.js REST API for SnapPass AI. Handles photo uploads, connects to the Python AI service for processing, and manages user authentication.

Runs on **`http://localhost:5000`**

---

##  Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- Python AI service running on `http://localhost:8000`

---

##  Local Setup

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env` file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the values — see [Environment Variables](#️-environment-variables) below.

### 4. Start MongoDB

```bash
# Windows (run as Administrator)
net start MongoDB

# Mac/Linux
brew services start mongodb-community
```

### 5. Start the backend

```bash
npm run dev
```

Backend will be running at `http://localhost:5000`

---

##  Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
NODE_ENV=development
AI_SERVICE_URL=http://localhost:8000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5174
MONGO_URI=mongodb://localhost:27017/snappass
JWT_SECRET=your_secret_key_here
RESEND_API_KEY=dummy_key_for_dev
EMAIL_FROM=test@test.com
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### What each variable does

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port backend runs on | ✅ Yes |
| `NODE_ENV` | `development` or `production` | ✅ Yes |
| `AI_SERVICE_URL` | URL of Python AI service | ✅ Yes |
| `UPLOAD_DIR` | Folder to store uploaded photos | ✅ Yes |
| `MAX_FILE_SIZE` | Max upload size in bytes (10MB = 10485760) | ✅ Yes |
| `CORS_ORIGIN` | Frontend URL allowed to call backend | ✅ Yes |
| `MONGO_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT auth tokens | ✅ Yes |
| `RESEND_API_KEY` | API key for email sending (Resend) | ✅ Yes |
| `EMAIL_FROM` | Sender email address | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary image hosting (optional) | ❌ No |
| `CLOUDINARY_API_KEY` | Cloudinary API key (optional) | ❌ No |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (optional) | ❌ No |

> **Note:** If Cloudinary variables are empty, uploaded photos are stored locally in the `uploads/` folder.

---

##  Folder Structure

```
backend/
├── docs/
│   ├── authentication.md            # Auth flow documentation
│   └── errorhandling.md             # Error handling documentation
├── src/
│   ├── app.js                       # Express app setup, middleware, routes
│   ├── config/
│   │   ├── config.js                # Reads and validates .env variables
│   │   └── db.js                    # MongoDB connection setup
│   ├── controllers/
│   │   ├── auth.controller.js       # Register, login, logout
│   │   ├── image.controller.js      # Forwards to Python AI service
│   │   ├── print.controller.js      # Generates A4 print sheet
│   │   └── upload.controller.js     # Handles photo upload logic
│   ├── dao/
│   │   ├── passwordResetOtp.dao.js  # OTP database queries
│   │   └── user.dao.js              # User database queries
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT authentication check
│   │   ├── error.middleware.js      # Global error handler
│   │   ├── rateLimit.middleware.js  # Rate limiting for auth routes
│   │   ├── upload.middleware.js     # Multer file upload config
│   │   └── validate.middleware.js   # express-validator error handler
│   ├── models/
│   │   ├── passwordResetOtp.model.js # OTP MongoDB schema
│   │   ├── printSheet.model.js       # Print sheet MongoDB schema
│   │   ├── processedImage.model.js   # Processed image MongoDB schema
│   │   ├── upload.model.js           # Upload MongoDB schema
│   │   ├── UploadHistory.js          # Upload history MongoDB schema
│   │   └── user.model.js             # User MongoDB schema
│   ├── routes/
│   │   ├── auth.routes.js           # POST /api/auth/*
│   │   ├── image.routes.js          # POST /api/process
│   │   ├── print.routes.js          # POST /api/print/*
│   │   └── upload.routes.js         # POST /api/upload
│   ├── service/
│   │   ├── auth.service.js          # Auth business logic
│   │   ├── cloudinary.service.js    # Cloudinary upload logic
│   │   └── passwordResetOtp.service.js # OTP logic
│   ├── utils/
│   │   ├── catchAsync.js            # Async error wrapper
│   │   ├── generateOTP.js           # OTP generator
│   │   ├── photoPresets.js          # Passport photo size presets
│   │   ├── sendEmail.js             # Email sender using Resend
│   │   ├── setToken.js              # JWT cookie setter
│   │   └── errors/
│   │       ├── AppError.js          # Base error class
│   │       ├── AuthError.js         # Auth specific errors
│   │       ├── NotFoundError.js     # 404 errors
│   │       └── ValidationError.js   # Validation errors
│   └── validation/
│       └── auth.validation.js       # express-validator rules
├── .env                             # Local environment variables (not committed)
├── .env.example                     # Template for .env
├── backend-rules.md                 # Backend coding rules
├── Dockerfile                       # Docker configuration
├── package.json                     # Dependencies
└── server.js                        # Entry point — starts Express server
```

---

##  Database Connection

`db.js` handles the MongoDB connection using Mongoose.

It is called once when the server starts in `server.js`:
- Connects to `MONGO_URI` from `.env`
- Logs `MongoDB connected` on success
- Crashes server on connection failure so the issue is caught immediately

---

##  API Endpoints

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check if backend is running |

**Response:**
```json
{ "status": "ok", "service": "SnapPass AI Backend" }
```

---

### Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload a photo |
| `GET` | `/api/upload/:fileId` | Get upload metadata |

**POST `/api/upload` — `multipart/form-data`:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `photo` | File | ✅ Yes | Portrait photo (JPEG, PNG, WEBP) |

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "message": "Photo uploaded successfully.",
  "data": {
    "fileId": "uuid-here",
    "filename": "photo-123.jpg",
    "fileUrl": "http://localhost:5000/uploads/photo-123.jpg"
  }
}
```

---

### Image Processing

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/process` | Send photo to Python AI service |
| `GET` | `/api/process/preview/:filename` | Get processed image preview |

**POST `/api/process` — JSON body:**

```json
{
  "filename": "photo-123.jpg",
  "backgroundColour": "white",
  "photoSizePreset": "35x45"
}
```

**When the Python AI service is unreachable**, the endpoint returns a
consistent `503 Service Unavailable` (instead of a generic 500 or a leaked
stack trace) so the frontend can show a graceful fallback message:

```json
{
  "success": false,
  "message": "AI service is unavailable. Please ensure python-ai-service is running."
}
```

---

### Print

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/print/generate-sheet` | Generate A4 print sheet |
| `GET` | `/api/print/presets` | Get all size presets |

---

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/auth/password-reset-request` | Request OTP |
| `POST` | `/api/auth/verify-otp` | Verify OTP |
| `POST` | `/api/auth/password-reset` | Reset password |

---

##  How Backend Connects to Python AI Service

```
React Frontend
     ↓  POST /api/upload  (multipart/form-data)
Express Backend (port 5000)
     ↓  saves file to uploads/
     ↓  returns filename to frontend
React Frontend
     ↓  POST /api/process  (filename, backgroundColour, preset)
Express Backend
     ↓  POST http://localhost:8000/remove-bg
Python AI Service (port 8000)
     ↓  bg removal + face centering + DPI resize
     ↓  returns processed PNG bytes
Express Backend
     ↓  streams PNG back to frontend
React Frontend — displays passport photo
```

### Axios call in `image.controller.js`

```javascript
const form = new FormData();
form.append("image", fs.createReadStream(filePath));
form.append("background_colour", backgroundColour);

const aiResponse = await axios.post(
  `${config.aiServiceUrl}/remove-bg`,
  form,
  {
    headers: { ...form.getHeaders() },
    responseType: "arraybuffer",
  }
);

res.set("Content-Type", "image/png");
res.send(Buffer.from(aiResponse.data));
```

---

##  MongoDB Setup

### Option 1 — Local MongoDB

1. Install [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Start MongoDB:
```bash
# Windows (as Administrator)
net start MongoDB

# Mac/Linux
brew services start mongodb-community
```
3. Set in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/snappass
```

### Option 2 — MongoDB Atlas (Free Cloud)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Set in `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/snappass
```

---

##  Common Errors & Fixes

**`MONGO_URI is not defined`**
Add `MONGO_URI` to your `.env` file and make sure MongoDB is running.

**`RESEND_API_KEY is not defined`**
Add `RESEND_API_KEY=dummy_key_for_dev` to `.env` for local development.

**`EMAIL_FROM is not defined`**
Add `EMAIL_FROM=test@test.com` to `.env` for local development.

**CORS error**
Check that `CORS_ORIGIN` in `.env` matches your frontend URL exactly including port:
```env
CORS_ORIGIN=http://localhost:5174
```

**`AI service unavailable (503)`**
Python AI service is not running. Start it first:
```bash
cd python-ai-service
python main.py
```

**`JWT_SECRET is not defined`**
Add `JWT_SECRET=any_random_string` to `.env`.

**`venv` not activating on Windows**
Run this in PowerShell first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

##  Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `multer` | File upload handling |
| `axios` | HTTP calls to Python AI service |
| `jsonwebtoken` | JWT authentication |
| `bcryptjs` | Password hashing |
| `cors` | Cross-origin requests |
| `helmet` | Security headers |
| `morgan` | Request logging |
| `dotenv` | Environment variables |
| `express-validator` | Request validation |
| `express-rate-limit` | Rate limiting |
| `cookie-parser` | Cookie handling |
| `resend` | Email sending |
| `cloudinary` | Image hosting (optional) |
| `uuid` | Unique ID generation |