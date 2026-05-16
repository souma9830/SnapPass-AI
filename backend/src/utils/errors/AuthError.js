/**
 * @description A custom error class that extends the built-in Error class to represent authentication errors in the application.
 * @class AuthError
 * @extends AppError
 */
import AppError from "./AppError.js";

class AuthError extends AppError {
  constructor(message = "Unauthorized Access") {
    super(message, 401);
  }
}

export default AuthError;