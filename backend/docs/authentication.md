# Authentication Feature Documentation

This document outlines the complete authentication architecture, flow, and endpoints in the SnapPass-AI backend application. It is designed to provide developers with a clear understanding of how user authentication is implemented, handled, and validated.

## Table of Contents

- [Overview](#overview)
- [Authentication Flow](#authentication-flow)
- [Endpoints](#endpoints)
  - [Register User](#1-register-user)
  - [Login User](#2-login-user)
  - [Logout User](#3-logout-user)
  - [Get Current User](#4-get-current-user)
  - [Request Password Reset](#5-request-password-reset)
  - [Verify Password Reset OTP](#6-verify-password-reset-otp)
  - [Reset Password](#7-reset-password)
- [Security Measures](#security-measures)

---

## Overview

The application utilizes a stateless authentication mechanism based on JSON Web Tokens (JWT). For enhanced security, tokens are stored in HTTP-only cookies rather than being returned in the JSON response body. This mitigates Cross-Site Scripting (XSS) attacks by preventing client-side scripts from accessing the token. 

The `cookie-parser` middleware is used to parse the incoming cookies automatically on protected routes.

---

## Authentication Flow

1. **Request Reception:** The client makes a request to one of the authentication endpoints (e.g., `/api/auth/register`).
2. **Validation (`auth.validation.js` & `validate.middleware.js`):** The request body is validated against predefined rules (e.g., checking password strength and email format). If it fails, a `400 Bad Request` or `ValidationError` is thrown immediately.
3. **Controller (`auth.controller.js`):** The validated data is passed to the controller, which orchestrates the logic using the `auth.service.js`.
4. **Service & DAO/Model (`auth.service.js` & `user.dao.js`):** Business logic is processed, such as hashing the password (via bcrypt), checking for existing users, and inserting or fetching from the database (`user.model.js`).
5. **Token Generation (`setToken.js`):** Upon successful authentication/registration, a JWT is generated. 
6. **Response Response:** The JWT is assigned to an HTTP-only cookie, and a success JSON response is sent back to the client. Subsequent requests to protected routes transmit this cookie automatically.

---

## Endpoints

All endpoints assume the `/api/auth` base prefix.

### 1. Register User

Creates a new user account, logs them in, and issues a JWT cookie.

- **Route:** `POST /register`
- **Access:** Public
- **Headers:** `Content-Type: application/json`

**Expected Input:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```
*Note: The password must be 8-32 characters, contain at least one uppercase letter, one lowercase letter, one number, one special character, and no spaces.*

**Success Response (201 Created):**
- **Set-Cookie Header:** `token=...; HttpOnly; SameSite=...`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "60d0fe4f5311236168a109ca",
    "fullName": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Common Error Responses:**
- `400 Bad Request` (Validation Failed: missing fields or weak password)
- `409 Conflict` (Email already in use)

---

### 2. Login User

Authenticates existing user credentials and returns a JWT cookie.

- **Route:** `POST /login`
- **Access:** Public
- **Headers:** `Content-Type: application/json`

**Expected Input:**
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

**Success Response (200 OK):**
- **Set-Cookie Header:** `jwt=...; HttpOnly; SameSite=...`
```json
{
  "status": "success",
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "fullName": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

**Common Error Responses:**
- `400 Bad Request` (Validation Failed: invalid email format or missing fields)
- `401 Unauthorized` (Invalid email or password)

---

### 3. Logout User

Logs out the user by clearing the JWT cookie.

- **Route:** `POST /logout`
- **Access:** Private (Requires valid JWT cookie)

**Expected Input:**
- None in body. Valid JWT in Cookies.

**Success Response (200 OK):**
- **Set-Cookie Header:** `jwt=; HttpOnly; Expires=...` (clears the cookie)
```json
{
  "status": "success",
  "message": "User logged out successfully"
}
```

**Common Error Responses:**
- `401 Unauthorized` (No valid token provided)

---

### 4. Get Current User

Retrieves the currently authenticated user's profile data using their cookie.

- **Route:** `GET /me`
- **Access:** Private (Requires valid JWT cookie)

**Expected Input:**
- None in body. Valid JWT in Cookies.

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "createdAt": "2026-05-18T10:00:00.000Z"
    }
  }
}
```

**Common Error Responses:**
- `401 Unauthorized` (No valid token provided or token expired)
- `404 Not Found` (User no longer exists in database)

---

### 5. Request Password Reset

Initiates the password reset process by generating a One-Time Password (OTP) and sending it to the user's registered email. The OTP expires in 5 minutes.

- **Route:** `POST /password-reset-request`
- **Access:** Public
- **Headers:** `Content-Type: application/json`

**Expected Input:**
```json
{
  "email": "jane@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent to your email successfully",
  "data": null
}
```

**Common Error Responses:**
- `400 Bad Request` (Validation Failed: invalid email format)
- `404 Not Found` (User not found)

---

### 6. Verify Password Reset OTP

Verifies the provided OTP for validity before allowing the user to set a new password. This endpoint does not consume the OTP; it just checks if it is correct and not expired.

- **Route:** `POST /verify-otp`
- **Access:** Public
- **Headers:** `Content-Type: application/json`

**Expected Input:**
```json
{
  "email": "jane@example.com",
  "otp": "123456"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": null
}
```

**Common Error Responses:**
- `400 Bad Request` (Invalid or expired OTP, or validation failed)
- `404 Not Found` (User not found)

---

### 7. Reset Password

Finalizes the password reset process by re-verifying and consuming the OTP, and updating the user's password.

- **Route:** `POST /password-reset`
- **Access:** Public
- **Headers:** `Content-Type: application/json`

**Expected Input:**
```json
{
  "email": "jane@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123!"
}
```
*Note: The new password must meet the same strict password requirements as registration.*

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

**Common Error Responses:**
- `400 Bad Request` (Validation Failed: missing fields or weak password, or invalid/expired OTP)
- `404 Not Found` (User not found)

---

## Security Measures

- **HTTP-Only Cookies:** Tokens are never exposed to front-end JavaScript, preventing XSS-based token theft.
- **Strict Password Policies:** Validation requirements mandate strong passwords during registration.
- **Normalization:** Emails are forced into standard formatting (via `normalizeEmail()`) to prevent duplicate bypassing techniques.
- **Route Protection:** All private routes are strictly gated by the `authMiddleware.js`, passing execution to controllers only if a verified, unexpired token corresponds to an active database user.

---

**Author:** Subham777-max  
**Last Updated:** May 19, 2026