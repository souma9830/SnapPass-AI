/**
 * Print Routes
 * POST /api/print/generate-sheet — Generate A4 print sheet
 * GET  /api/print/presets        — List supported size presets
 */

import express from "express";
import { generateSheet, getSizePresets } from "../controllers/print.controller.js";
import validate from "../middleware/validate.middleware.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";
import { generateSheetValidation } from "../validation/print.validation.js";

const router = express.Router();

router.post(
  "/generate-sheet",
  generateSheetValidation,
  validate,
  generateSheet
);

router.get(
  "/presets",
  cacheMiddleware(3600),
  getSizePresets
);

export default router;