/**
 * Upload Routes
 * POST /api/upload  — Upload a photo
 * GET  /api/upload/:fileId — Get upload metadata
 */

const express = require("express");
const router = express.Router();

const { uploadPhoto, getUploadedPhoto } = require("../controllers/upload.controller");
const { uploadMiddleware } = require("../middlewares/upload.middleware");
const { validateUpload } = require("../middlewares/validate.middleware");

router.post("/", uploadMiddleware.single("photo"), validateUpload, uploadPhoto);
router.get("/:fileId", getUploadedPhoto);

module.exports = router;
