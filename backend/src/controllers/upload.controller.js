import path from 'path';
import fs from 'fs';

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
      return res.status(400).json({
        success: false,
        message:
          'No image file received. Please attach a JPEG, PNG, or WebP photo.',
      });
    }

    const { filename, size, mimetype } = req.file;
    const meta = req.imageMeta || {};

    return res.status(200).json({
      success: true,
      message: 'Photo uploaded and validated successfully.',
      data: {
        filename,
        fileSize: size,
        mimeType: mimetype,
        // Pixel dimensions are populated by validateImageChain middleware
        width: meta.width ?? null,
        height: meta.height ?? null,
        // Clients can pass this filename directly to POST /api/process
        processUrl: `/api/process`,
      },
    });
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
    res.status(200).json({
      success: true,
      message: `${results.length} file(s) uploaded successfully`,
      files: results,
    });
  } catch (err) {
    next(err);
  }
};
