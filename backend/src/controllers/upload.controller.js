import { successResponse, errorResponse } from '../utils/httpResponse.js';
import UploadHistory from '../models/UploadHistory.js';

/**
 * POST /api/upload
 *
 * Handles photo uploads.  By the time this controller runs the multer
 * uploadMiddleware + validateImageChain middleware pipeline has already:
 *   1. Rejected any file with an invalid MIME type or extension.
 *   2. Verified the binary magic bytes against JPEG / PNG / WebP signatures.
 *   3. Confirmed pixel dimensions are within accepted bounds.
 *   4. Stored the suspicious-compression-ratio check result.
 *
 * This handler assembles and returns a structured payload the frontend
 * can use directly for subsequent AI-processing and print-sheet calls.
 */
export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No image file received. Please attach a JPEG, PNG, or WebP photo.', 400);
    }

    const { filename, size, mimetype } = req.file;
    const meta = req.imageMeta || {};

    if (req.user?.id) {
      await UploadHistory.create({
        user: req.user.id,
        fileId: req.file.id || filename,
        filename,
        originalImage: filename,
        processed: false,
        status: 'pending',
      }).catch((err) => next(err));
    }

    return successResponse(res, {
      filename,
      fileSize: size,
      mimeType: mimetype,
      width: meta.width ?? null,
      height: meta.height ?? null,
      processUrl: `/api/process`,
    }, 'Photo uploaded and validated successfully.');
  } catch (err) {
    next(err);
  }
};

export const batchUpload = async (req, res, next) => {
  try {
    const files = req.files || [];
    const results = files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      uploaded: true,
    }));

    if (req.user?.id && files.length > 0) {
      await UploadHistory.insertMany(
        files.map((f) => ({
          user: req.user.id,
          fileId: f.id || f.filename,
          filename: f.filename,
          originalImage: f.filename,
          processed: false,
          status: 'pending',
        }))
      ).catch((err) => next(err));
    }

    successResponse(res, { files: results }, `${results.length} file(s) uploaded successfully`);
  } catch (err) {
    next(err);
  }
};
