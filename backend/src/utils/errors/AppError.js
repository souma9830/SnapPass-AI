/**
 * @description A custom error class that extends the built-in Error class to include additional properties such as status code and operational status.
 * @class AppError
 * @extends Error
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = this.constructor.name;
    
    this.statusCode = statusCode;

    this.status =
      statusCode >= 400 && statusCode < 500
        ? "fail"
        : "error";

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;