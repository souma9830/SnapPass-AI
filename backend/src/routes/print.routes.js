/**
 * Print Routes
 * POST /api/print/generate-sheet — Generate A4 print sheet
 * GET  /api/print/presets        — List supported size presets
 */

const express = require("express");
const router = express.Router();

const { generateSheet, getSizePresets } = require("../controllers/print.controller");

router.post("/generate-sheet", generateSheet);
router.get("/presets", getSizePresets);

module.exports = router;
