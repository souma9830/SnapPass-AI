/**
 * Upload Routes
 * POST /api/upload  — Upload a photo
 * GET  /api/upload/:fileId — Get upload metadata
 */

import express from "express";
import { uploadPhoto, getUploadedPhoto } from "../controllers/upload.controller.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";
import { validateUpload } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/", uploadMiddleware.single("photo"), validateUpload, uploadPhoto);
router.get("/:fileId", getUploadedPhoto);

export default router;
