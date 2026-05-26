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
  if (!err.isOperational) {
    console.error(err);
  }

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message:
      err.message || "Internal Server Error",

    errors: err.errors || undefined,

    stack:
      config.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};

export default errorMiddleware;