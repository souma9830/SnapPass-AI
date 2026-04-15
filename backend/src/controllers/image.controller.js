/**
 * Image Controller
 * Orchestrates calls to the Python AI microservice for image processing:
 *  - Background removal
 *  - Face detection & centering
 *  - DPI optimisation & resizing
 */

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const config = require("../config/app.config");

/**
 * POST /api/process
 * Body: { filename, backgroundColour, photoSizePreset }
 * Calls the AI service /process endpoint and returns processed image URL.
 */
const processImage = async (req, res, next) => {
  try {
    const { filename, backgroundColour = "white", photoSizePreset = "35x45" } = req.body;

    if (!filename) {
      return res.status(400).json({ success: false, message: "filename is required." });
    }

    const filePath = path.join(__dirname, "..", "..", "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found on server." });
    }

    // Forward to Python AI service
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));
    form.append("background_colour", backgroundColour);
    form.append("photo_size_preset", photoSizePreset);

    const aiResponse = await axios.post(`${config.aiServiceUrl}/process`, form, {
      headers: form.getHeaders(),
      responseType: "arraybuffer",
    });

    // TODO: Save processed image to disk and return URL
    // For now, stream the AI response back directly
    res.set("Content-Type", "image/png");
    res.send(Buffer.from(aiResponse.data));
  } catch (error) {
    // Graceful fallback if AI service is unavailable
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message: "AI service is unavailable. Please ensure python-ai-service is running.",
      });
    }
    next(error);
  }
};

/**
 * GET /api/process/preview/:filename
 * Returns a lightweight preview of the processed image.
 */
const getPreview = async (req, res, next) => {
  try {
    const { filename } = req.params;
    // TODO: Implement preview retrieval from processed images directory
    res.json({
      success: true,
      data: { filename, previewUrl: `/uploads/processed/${filename}` },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { processImage, getPreview };
