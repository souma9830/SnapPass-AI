/**
 * error.middleware.js — centralised error handling for the Express application.
 *
 * Responsibilities:
 *   1. Translate well-known error types (Multer, Mongoose validation, JWT) into
 *      meaningful HTTP status codes and user-friendly messages.
 *   2. Never expose internal stack traces or error details in production
 *      responses — those are logged server-side only.
 *   3. Always include the correlationId so support teams can cross-reference
 *      logs from the client error report.
 *
 * Error classification hierarchy:
 *   MulterError        → 400 / 413 depending on the Multer error code
 *   ValidationError    → 422 (Mongoose / express-validator)
 *   SyntaxError (JSON) → 400
 *   AppError           → uses the statusCode attached to the error object
 *   Unhandled          → 500 (message hidden in production)
 */

import multer from 'multer';
import logger from '../utils/logger.js';
import { TelemetryLogger } from '../utils/telemetryLogger.js';
import { config } from '../config/config.js';

const isProduction = () => config.NODE_ENV === 'production';

/**
 * Map Multer error codes to HTTP status codes and actionable user messages.
 */
const MULTER_ERROR_MAP = {
  LIMIT_FILE_SIZE: {
    status: 413,
    message: 'File is too large. Maximum allowed size is 10 MB.',
  },
  LIMIT_FILE_COUNT: {
    status: 400,
    message:
      'Too many files uploaded at once. Please upload one photo at a time.',
  },
  LIMIT_UNEXPECTED_FILE: {
    status: 400,
    message:
      'Unexpected form field. Use the "photo" field to upload your image.',
  },
  LIMIT_FIELD_COUNT: {
    status: 400,
    message: 'Too many form fields submitted.',
  },
  LIMIT_PART_COUNT: {
    status: 400,
    message: 'Multipart request has too many parts.',
  },
};

/**
 * Build a safe, sanitised error payload for the HTTP response.
 * In production the `detail` key is omitted to avoid leaking internals.
 */
const buildPayload = (statusCode, message, correlationId, detail = null) => {
  const payload = { success: false, message, correlationId };
  if (!isProduction() && detail) {
    payload.detail = detail;
  }
  return { statusCode, payload };
};

const errorMiddleware = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const correlationId = req.id || req.headers['x-request-id'] || null;

  // ── Multer errors (file upload validation) ────────────────────────────────
  if (err instanceof multer.MulterError) {
    const mapped = MULTER_ERROR_MAP[err.code];
    const status = mapped?.status ?? 400;
    const message = mapped?.message ?? `Upload error: ${err.message}`;

    logger.warn({
      event: 'multer_error',
      code: err.code,
      correlationId,
      path: req.path,
    });

    return res.status(status).json({ success: false, message, correlationId });
  }

  // ── Mongoose validation errors → 422 ─────────────────────────────────────
  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');

    logger.warn({
      event: 'validation_error',
      messages,
      correlationId,
      path: req.path,
    });

    const { payload } = buildPayload(422, messages, correlationId);
    return res.status(422).json(payload);
  }

  // ── Malformed JSON body ───────────────────────────────────────────────────
  if (err instanceof SyntaxError && 'body' in err) {
    logger.warn({ event: 'malformed_json', correlationId, path: req.path });
    const { payload } = buildPayload(
      400,
      'Malformed JSON in request body.',
      correlationId
    );
    return res.status(400).json(payload);
  }

  // ── JWT / auth errors ─────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    logger.warn({
      event: 'jwt_error',
      name: err.name,
      correlationId,
      path: req.path,
    });
    const msg =
      err.name === 'TokenExpiredError'
        ? 'Your session has expired. Please log in again.'
        : 'Invalid authentication token.';
    const { payload } = buildPayload(401, msg, correlationId);
    return res.status(401).json(payload);
  }

  // ── Application errors (AppError / custom statusCode) ────────────────────
  const statusCode = err.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    logger.error({
      event: 'unhandled_error',
      message: err.message,
      stack: err.stack,
      correlationId,
      path: req.path,
    });
  } else {
    logger.warn({
      event: 'client_error',
      message: err.message,
      statusCode,
      correlationId,
      path: req.path,
    });
  }

  const userMessage =
    isServerError && isProduction()
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Internal Server Error';

  const { payload } = buildPayload(
    statusCode,
    userMessage,
    correlationId,
    isServerError ? err.stack : null
  );

  return res.status(statusCode).json(payload);
};

export default errorMiddleware;
