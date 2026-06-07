# API Specification

## Auth Endpoints
* `POST /api/v1/auth/register` - Create user
* `POST /api/v1/auth/login` - Login user
* `POST /api/v1/auth/logout` - Logout user

## Image Endpoints
* `POST /api/v1/upload` - Upload raw image
* `POST /api/v1/process/face-quality-check` - Face quality analysis
* `POST /api/v1/print/generate-sheet` - Generate ready-to-print A4 sheet
