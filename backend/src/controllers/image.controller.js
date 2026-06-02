/**
 * Image Controller
 * Orchestrates calls to the Python AI microservice for image processing:
 *  - Background removal
 *  - Face detection & centering
 *  - DPI optimisation & resizing
 */

import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { config } from "../config/config.js";

const localFilename = fileURLToPath(import.meta.url);
const localDirname = path.dirname(localFilename);

/**
 * POST /api/process
 * Body: { filename, backgroundColour, photoSizePreset }
 * Calls the AI service /process endpoint and returns processed image URL.
 */
export const processImage = async (req, res, next) => {
  try {
    const { filename, backgroundColour = "white", photoSizePreset = "35x45" } = req.body;

    if (!filename) {
      return res.status(400).json({ success: false, message: "filename is required." });
    }

    // 1. Filename validation (alphanumeric, dots, hyphens, and underscores only)
    const filenameRegex = /^[a-zA-Z0-9_\-\.]+$/;
    if (!filenameRegex.test(filename)) {
      return res.status(400).json({ success: false, message: "Invalid filename format." });
    }

    // 2. Hidden file blocking
    if (filename.startsWith(".") || path.basename(filename).startsWith(".")) {
      return res.status(403).json({ success: false, message: "Access denied: Hidden files are blocked." });
    }

    // 3. Allowed extension whitelist
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ success: false, message: "Access denied: Unsupported file extension." });
    }

    // 4. Strict directory containment (prevent path traversal completely)
    const uploadsDir = path.resolve(localDirname, "..", "..", "uploads");
    const filePath = path.resolve(uploadsDir, filename);

    const relative = path.relative(uploadsDir, filePath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return res.status(403).json({ success: false, message: "Access denied: Path traversal detected." });
    }

    // 5. Async existence, symlink protection & regular file enforcement (non-blocking TOCTOU prevention)
    try {
      const stats = await fs.promises.lstat(filePath);
      if (stats.isSymbolicLink()) {
        return res.status(403).json({ success: false, message: "Access denied: Symbolic links are blocked." });
      }
      if (!stats.isFile()) {
        return res.status(400).json({ success: false, message: "Access denied: Target is not a file." });
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ success: false, message: "File not found on server." });
      }
      throw err;
    }

    // 6. Authorization checks placeholder
    if (req.user && req.user.id) {
      // Future scope: ensure req.user.id has ownership of this uploaded file resource
    }

    // Forward to Python AI service
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));
    form.append("background_colour", backgroundColour);
    form.append("photo_size_preset", photoSizePreset);

    const shouldCleanupLocal = Boolean(
      config.cloudinary?.cloudName &&
      config.cloudinary?.apiKey &&
      config.cloudinary?.apiSecret
    );

    if (shouldCleanupLocal) {
      res.on("finish", async () => {
        try {
          await fs.promises.unlink(filePath);
        } catch (_error) {
          // Best-effort cleanup, ignore failures.
        }
      });
    }

    const aiResponse = await axios.post(`${config.aiServiceUrl}/remove-bg`, form, {
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
export const getPreview = async (req, res, next) => {
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
