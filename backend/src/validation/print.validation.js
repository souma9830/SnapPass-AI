import { body } from "express-validator";
import { PHOTO_SIZE_PRESETS } from "../utils/photoPresets.js";

export const generateSheetValidation = [
    body("filename")
        .trim()
        .notEmpty()
        .withMessage("filename is required"),

    body("quantity")
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage("quantity must be between 1 and 20"),

    body("photoSizePreset")
        .optional()
        .isIn(PHOTO_SIZE_PRESETS)
        .withMessage(
            `photoSizePreset must be one of: ${PHOTO_SIZE_PRESETS.join(", ")}`
        ),
];
