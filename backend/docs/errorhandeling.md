# Centralized Error Handling Documentation

This document outlines the centralized error handling architecture used in the backend of the SnapPass-AI application. It is designed to be a quick start guide for new developers to understand how to throw, catch, and handle errors efficiently and uniformly across the codebase.

## Table of Contents

- [Overview](#overview)
- [The `AppError` Class](#the-apperror-class)
- [Pre-defined Error Classes](#pre-defined-error-classes)
- [Deep Dive: `ValidationError` & Validation Middleware](#deep-dive-validationerror--validation-middleware)
- [The `catchAsync` Utility](#the-catchasync-utility)
- [Error Handling Middleware](#error-handling-middleware)
- [Usage Examples](#usage-examples)

---

## Overview

The application uses a centralized error-handling strategy to ensure that all errors (both operational and programming/unknown) are caught and processed in a single place. This guarantees consistent API responses and simplifies controller logic.

Key components:
1. **Custom Error Classes:** Extend the base `AppError` to encapsulate HTTP status codes and specific error logic.
2. **`catchAsync` Wrapper:** Eliminates the need for repetitive `try-catch` blocks in asynchronous route handlers.
3. **Global Error Middleware:** Intercepts all errors passed down the middleware chain and formats the HTTP response.

---

## The `AppError` Class

All operational errors (errors that we can predict and handle properly, like invalid user input or missing files) should be initiated using the `AppError` class or its variants.

**Location:** `src/utils/errors/AppError.js`

```javascript
import AppError from '../utils/errors/AppError.js';

// Example: Throwing a generic application error
throw new AppError('Unable to process request', 400);
```

### Properties of `AppError`:
- `message`: Descriptive message of the error.
- `statusCode`: HTTP status code (e.g., 400, 404, 500).
- `status`: Derived from the status code (`fail` for 4xx, `error` for 5xx).
- `isOperational`: Boolean flag (`true` by default) used by the global error handler to determine if the error should be exposed to the client.

---

## Pre-defined Error Classes

To maintain consistency, use the specific error classes provided in `src/utils/errors/` for typical HTTP errors:

- **`NotFoundError` (404):** When a resource or route is not found.
- **`ValidationError` (400):** When user input fails validation.
- **`AuthError` (401/403):** When authentication or authorization fails.

**Example Usage:**
```javascript
import NotFoundError from '../utils/errors/NotFoundError.js';

if (!user) {
  throw new NotFoundError('User not found in the database');
}
```

---

## Deep Dive: `ValidationError` & Validation Middleware

The application uses `express-validator` to validate incoming requests. To seamlessly integrate it with our centralized error handling, we have a specialized `ValidationError` class and a `validate` middleware.

### 1. The `ValidationError` Class
**Location:** `src/utils/errors/ValidationError.js`

Unlike other error classes that take a single string message, `ValidationError` is designed to receive an array of formatting or rule breakdown errors. It automatically sets the HTTP status code to `400` (Bad Request) and the message to `"Validation Failed"`.

### 2. The `validate` Middleware
**Location:** `src/middleware/validate.middleware.js`

This middleware evaluates the validation rules assigned to a route. If `express-validator` records any issues, this middleware collects them and throws a `ValidationError` containing the array of details.

**How to use it alongside `express-validator` chains:**

```javascript
import { body } from 'express-validator';
import validate from '../middleware/validate.middleware.js';

// Route definition example
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate, // Evaluates the rules above and throws ValidationError if it fails
  authController.register // Reached only if validation passes
);
```

---

## The `catchAsync` Utility

`catchAsync` is a higher-order function that wraps asynchronous controllers. It automatically catches any exceptions (or rejected Promises) and passes them to the next middleware via `next(err)`. 

**Location:** `src/utils/catchAsync.js`

**Why use it?**
It keeps controller files clean by removing the need for `try-catch` blocks.

### Standard Controller (Without `catchAsync`)
```javascript
export const getUser = async (req, res, next) => {
  try {
    const user = await UserService.findById(req.params.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
};
```

### Clean Controller (With `catchAsync`)
```javascript
import catchAsync from '../utils/catchAsync.js';
import NotFoundError from '../utils/errors/NotFoundError.js';

export const getUser = catchAsync(async (req, res, next) => {
  const user = await UserService.findById(req.params.id);
  
  if (!user) {
    // Automatically caught by catchAsync and passed to the global error handler
    throw new NotFoundError('User not found'); 
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});
```

---

## Error Handling Middleware

The global error handling middleware is responsible for formatting the error response sent back to the client. It intercepts any error passed into the `next()` function or thrown within a `catchAsync` block.

**Location:** `src/middleware/error.middleware.js`

It handles:
- Formatting responses depending on the environment (development vs. production).
- Preventing sensitive internal server details from leaking to users in production (only exposing `isOperational` errors).

---

## Usage Examples

### 1. Handling Missing Data (Controller)
```javascript
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/errors/AppError.js';

export const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    throw new AppError('Please provide an image file', 400);
  }
  
  // Process the file...
  res.status(200).json({ status: 'success', message: 'Image uploaded' });
});
```

### 2. Handling Third-Party API Rejections
```javascript
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/errors/AppError.js';
import ExternalService from '../service/ExternalService.js';

export const processPayment = catchAsync(async (req, res, next) => {
  const result = await ExternalService.charge(req.body.amount);
  
  if (!result.success) {
    // This throws directly to the global handler
    throw new AppError('Payment gateway failed to process the transaction', 502);
  }

  res.status(200).json({ status: 'success', data: result });
});
```

By adhering to this structure, we ensure maximum code reusability, avoid boilerplate `try-catch` segments, and maintain scalable and predictable client-side error responses.

---

**Author:** Subham777-max  
**Last Updated:** May 16, 2026