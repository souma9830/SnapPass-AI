/**
 * Image Processing Routes
 * POST /api/process        — Process uploaded image (bg removal, face centre, resize)
 * GET  /api/process/preview/:filename — Get preview of processed image
 */

import express from "express";
import { processImage, getPreview } from "../controllers/image.controller.js";
import validate from "../middleware/validate.middleware.js";
import { processImageValidation } from "../validation/image.validation.js";

const router = express.Router();

router.post("/", processImageValidation, validate,processImage);
router.get("/preview/:filename", getPreview);

export default router;
