/**
 * Upload Middleware
 * Configures multer for disk storage with file type & size validation.
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { config } from "../config/config.js";

const localFilename = fileURLToPath(import.meta.url);
const localDirname = path.dirname(localFilename);

// Ensure uploads directory exists
const uploadDir = path.join(localDirname, "..", "..", config.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `photo-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (config.upload.allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed."), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.MAX_FILE_SIZE },
});
