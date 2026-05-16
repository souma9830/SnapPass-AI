/**
 * @description A custom error class that extends the built-in Error class to represent not found errors in the application.
 * @class NotFoundError
 * @extends AppError
 */
import AppError from "./AppError.js";

class NotFoundError extends AppError {
  constructor(message = "Resource Not Found") {
    super(message, 404);
  }
}

export default NotFoundError;