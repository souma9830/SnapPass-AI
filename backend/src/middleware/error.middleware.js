import { config } from "../config/config.js";
import AppError from "../utils/errors/AppError.js";

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message ? err.message.match(/(["'])(\\?.)*?\1/)?.[0] || 'value' : 'value';
  return new AppError(`Duplicate field value: ${value}. Please use another value!`, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data: ${errors.join(". ")}`, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  if (err.name === "CastError") error = handleCastErrorDB(error);
  if (err.code === 11000) error = handleDuplicateFieldsDB(error);
  if (err.name === "ValidationError") error = handleValidationErrorDB(error);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  res.status(statusCode).json({
    success: false,
    status,
    message: error.message || "Internal Server Error",
    errors: error.errors || undefined,
    stack: config.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default errorMiddleware;