/**
 * Image Processing Routes
 * POST /api/process        — Process uploaded image (bg removal, face centre, resize)
 * GET  /api/process/preview/:filename — Get preview of processed image
 */

const express = require("express");
const router = express.Router();

const { processImage, getPreview } = require("../controllers/image.controller");

router.post("/", processImage);
router.get("/preview/:filename", getPreview);

module.exports = router;
