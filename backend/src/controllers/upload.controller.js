/**
 * Upload Controller
 * Handles photo upload requests.
 * Validates file, saves to disk, and forwards to AI service for initial processing.
 */

import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "../service/cloudinary.service.js";
import Upload from "../models/upload.model.js";
import { config } from "../config/config.js";

/**
 * POST /api/upload
 * Accepts a multipart image upload and responds with the stored file path.
 */
export const uploadPhoto = async (req, res, next) => {
  let localPath;
  let isCloudinaryUsed = false;
  try {
    // multer middleware has already saved the file at this point
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    localPath = req.file.path;
    const fileId = uuidv4();
    
    let fileUrl;
    let publicId = null;

    const { cloudName, apiKey, apiSecret } = config.cloudinary;
    if (cloudName && apiKey && apiSecret) {
      const cloudinaryResult = await uploadImage(localPath);
      fileUrl = cloudinaryResult.secure_url;
      publicId = cloudinaryResult.public_id;
      isCloudinaryUsed = true;
    } else {
      // Fallback to local URL
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    if (req.user?.id) {
      await Upload.create({
        user: req.user.id,
        fileId,
        originalName: req.file.originalname,
        fileUrl,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
      });
    }

    res.status(201).json({
      success: true,
      message: "Photo uploaded successfully" + (isCloudinaryUsed ? "." : " (locally)."),
      data: {
        fileId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileUrl,
        publicId,
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
