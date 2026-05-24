/**
 * Print Controller
 * Handles generation of A4 print-ready photo sheets.
 * Coordinates with the AI service's sheet generation endpoint.
 */

import axios from "axios";
import { config } from "../config/config.js";
import { PHOTO_SIZE_DETAILS } from "../utils/photoPresets.js";

/**
 * POST /api/print/generate-sheet
 * Body: { filename, quantity, photoSizePreset }
 * Requests the AI service to arrange passport photos on an A4 sheet.
 */
export const generateSheet = async (req, res, next) => {
  try {
    const { filename, quantity = 6, photoSizePreset = "35x45" } = req.body;

    if (!filename) {
      return res.status(400).json({ success: false, message: "filename is required." });
    }

    const aiResponse = await axios.post(
      `${config.aiServiceUrl}/generate-sheet`,
      { filename, quantity, photo_size_preset: photoSizePreset },
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
