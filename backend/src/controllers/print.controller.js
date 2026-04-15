/**
 * Print Controller
 * Handles generation of A4 print-ready photo sheets.
 * Coordinates with the AI service's sheet generation endpoint.
 */

const axios = require("axios");
const config = require("../config/app.config");

/**
 * POST /api/print/generate-sheet
 * Body: { filename, quantity, photoSizePreset }
 * Requests the AI service to arrange passport photos on an A4 sheet.
 */
const generateSheet = async (req, res, next) => {
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
const getSizePresets = async (_req, res) => {
  const presets = [
    { id: "35x45", label: "35×45 mm (India / UK)", widthMm: 35, heightMm: 45 },
    { id: "51x51", label: "51×51 mm (USA Visa)", widthMm: 51, heightMm: 51 },
    { id: "33x48", label: "33×48 mm (Schengen Visa)", widthMm: 33, heightMm: 48 },
    { id: "40x60", label: "40×60 mm (China Visa)", widthMm: 40, heightMm: 60 },
    { id: "2x2in", label: '2×2 inch (US Passport)', widthMm: 50.8, heightMm: 50.8 },
  ];

  res.json({ success: true, data: presets });
};

module.exports = { generateSheet, getSizePresets };
