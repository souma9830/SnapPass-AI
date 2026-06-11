import { config } from "../config/config.js";

/**
 * @description A middleware function to handle errors in the application. It logs the error and sends a structured JSON response to the client.
 * @param {Error} err - The error object that was thrown.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  let error = { ...err };
  error.message = err.message || "Internal Server Error";
  error.statusCode = err.statusCode || err.status || 500;

  // Log non-operational errors
  if (!err.isOperational) {
    console.error("💥 SYSTEM ERROR:", err);
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    error.message = `Resource not found with id of ${err.value}`;
    error.statusCode = 404;
  }

  // Handle Mongo Duplicate Key Error
  if (err.code === 11000) {
    error.message = `Duplicate field value entered.`;
    error.statusCode = 400;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors).map(val => val.message).join(", ");
    error.statusCode = 400;
  }

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid authentication token. Please log in again.";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Your session token has expired. Please log in again.";
    error.statusCode = 401;
  }

  // Log request correlation trace ID
  const correlationId = req.headers['x-correlation-id'] || 'N/A';
  res.status(error.statusCode).json({
    correlationId,
    success: false,
    status: error.statusCode >= 500 ? "error" : "fail",
    message: error.message,
    errors: err.errors || undefined,
    stack: config.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;