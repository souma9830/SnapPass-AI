/**
 * @description A custom error class that extends the built-in Error class to represent validation errors in the application.
 * @class ValidationError
 * @extends AppError
 */
import AppError from "./AppError.js";

class ValidationError extends AppError {
  constructor(errors) {
    super("Validation Failed", 400);

    this.errors = errors;
  }
}

export default ValidationError;