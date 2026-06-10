import { param } from "express-validator";

export const getUploadedPhotoValidation = [
    param("fileId")
        .trim()
        .notEmpty()
        .withMessage("File ID is required")
        .isString()
        .withMessage("File ID must be a string")
        .isLength({ min: 10, max: 100 })
        .withMessage("File ID must be a valid length between 10 and 100 characters")
];
