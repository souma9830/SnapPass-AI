/**
 * Print Controller
 * Handles generation of A4 print-ready photo sheets.
 * Coordinates with the AI service's sheet generation endpoint.
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "../config/config.js";
import { PHOTO_SIZE_DETAILS } from "./presets.controller.js";

const localFilename = fileURLToPath(import.meta.url);
const localDirname = path.dirname(localFilename);

/**
 * POST /api/print/generate-sheet
 * Body: { filename, quantity, photoSizePreset }
 * Requests the AI service to arrange passport photos on an A4 sheet.
 */
export const generateSheet = async (req, res, next) => {
  try {
    const { filename, filenames, quantity = 6, photoSizePreset = "35x45", layout = "a4" } = req.body;

    const inputFilenames = filenames || (filename ? [filename] : []);
    
    if (inputFilenames.length === 0) {
      return res.status(400).json({ success: false, message: "filename or filenames array is required." });
    }

    const filePaths = [];
    const uploadsDir = path.resolve(localDirname, "..", "..", "uploads");

    for (const f of inputFilenames) {
      // 1. Filename validation (alphanumeric, dots, hyphens, and underscores only)
      const filenameRegex = /^[a-zA-Z0-9_\-\.]+$/;
      if (!filenameRegex.test(f)) {
        return res.status(400).json({ success: false, message: `Invalid filename format: ${f}` });
      }

      // 2. Hidden file blocking
      if (f.startsWith(".") || path.basename(f).startsWith(".")) {
        return res.status(403).json({ success: false, message: `Access denied: Hidden files are blocked: ${f}` });
      }

      // 3. Allowed extension whitelist
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      const ext = path.extname(f).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({ success: false, message: `Access denied: Unsupported file extension: ${f}` });
      }

      // 4. Strict directory containment (prevent path traversal completely)
      const filePath = path.resolve(uploadsDir, f);
      const relative = path.relative(uploadsDir, filePath);
      if (relative.startsWith("..") || path.isAbsolute(relative)) {
        return res.status(403).json({ success: false, message: `Access denied: Path traversal detected: ${f}` });
      }

      // 5. Async existence, symlink protection & regular file enforcement (non-blocking TOCTOU prevention)
      try {
        const stats = await fs.promises.lstat(filePath);
        if (stats.isSymbolicLink()) {
          return res.status(403).json({ success: false, message: `Access denied: Symbolic links are blocked: ${f}` });
        }
        if (!stats.isFile()) {
          return res.status(400).json({ success: false, message: `Access denied: Target is not a file: ${f}` });
        }
      } catch (err) {
        if (err.code === "ENOENT") {
          return res.status(404).json({ success: false, message: `File not found on server: ${f}` });
        }
        throw err;
      }
      
      filePaths.push(filePath);
    }

    // 6. Quantity boundary check (1 to 50)
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 50) {
      return res.status(400).json({ success: false, message: "Quantity must be an integer between 1 and 50." });
    }

    // Layout configuration check
    const allowedLayouts = ["a4", "letter", "4x6"];
    if (!allowedLayouts.includes(layout)) {
      return res.status(400).json({ success: false, message: "Invalid layout selection." });
    }

    // 7. Call python AI microservice with correct parameter mappings
    const aiResponse = await axios.post(
      `${config.aiServiceUrl}/generate-sheet`,
      { photo_paths: filePaths, quantity: parsedQuantity, preset_id: photoSizePreset, layout },
      { responseType: "arraybuffer" }
    );

    res.set("Content-Type", "image/png");
    res.set("Content-Disposition", `attachment; filename="snappass_sheet_${Date.now()}.png"`);
    res.send(Buffer.from(aiResponse.data));
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message: "AI service unavailable. Please start python-ai-service.",
      });
    }
    next(error);
  }
};

/**
 * GET /api/print/presets
 * Returns the list of supported passport photo size presets.
 */
export const getSizePresets = async (_req, res) => {
  res.json({ success: true, data: PHOTO_SIZE_DETAILS });
};
