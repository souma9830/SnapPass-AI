/**
 * @description This middleware should be used after defining validation rules using express-validator
 * @throws {ValidationError} if validation fails, containing an array of error details
 */
import { validationResult } from "express-validator";
import ValidationError from "../utils/errors/ValidationError.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new ValidationError(errors.array())
    );
  }

  next();
};

export default validate;