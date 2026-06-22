/**
 * Image Processing Routes
 * POST /api/process        — Process uploaded image (bg removal, face centre, resize)
 * GET  /api/process/preview/:filename — Get preview of processed image
 */

import express from "express";
import { processImage, getPreview } from "../controllers/image.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, processImage);
router.get("/preview/:filename", getPreview);

export default router;
