/**
 * Upload Controller
 * Handles photo upload requests.
 * Validates file, saves to disk, and forwards to AI service for initial processing.
 */

import { v4 as uuidv4 } from "uuid";
import { config } from "../config/config.js";
import Upload from "../models/Upload.js";

/**
 * POST /api/upload
 * Accepts a multipart image upload and responds with the stored file path.
 */
export const uploadPhoto = async (req, res, next) => {
  try {
    // multer middleware has already saved the file at this point
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const fileId = uuidv4();
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    await Upload.create({
      fileId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: "Photo uploaded successfully.",
      data: {
        fileId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileUrl,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/upload/:fileId
 * Returns metadata for a previously uploaded file.
 */
export const getUploadedPhoto = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const file = await Upload.findOne({ fileId }).lean();

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found." });
    }

    res.json({ success: true, data: file });
  } catch (error) {
    next(error);
  }
};
