/**
 * Face Detection Controller
 * Proxies multi-face detection requests to the Python AI microservice.
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { config } from '../config/config.js';

export const detectFaces = async (req, res, next) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ success: false, message: 'filename is required.' });
    }

    const filenameRegex = /^[a-zA-Z0-9_\-\.]+$/;
    if (!filenameRegex.test(filename)) {
      return res.status(400).json({ success: false, message: 'Invalid filename format.' });
    }

    if (filename.startsWith('.') || path.basename(filename).startsWith('.')) {
      return res.status(403).json({ success: false, message: 'Access denied: Hidden files are blocked.' });
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ success: false, message: 'Access denied: Unsupported file extension.' });
    }

    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    const filePath = path.resolve(uploadsDir, filename);

    const relative = path.relative(uploadsDir, filePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      return res.status(403).json({ success: false, message: 'Access denied: Path traversal detected.' });
    }

    try {
      const stats = await fs.promises.lstat(filePath);
      if (stats.isSymbolicLink()) {
        return res.status(403).json({ success: false, message: 'Access denied: Symbolic links are blocked.' });
      }
      if (!stats.isFile()) {
        return res.status(400).json({ success: false, message: 'Access denied: Target is not a file.' });
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ success: false, message: 'File not found on server.' });
      }
      throw err;
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));

    const aiResponse = await axios.post(`${config.aiServiceUrl}/detect-faces`, form, {
      headers: form.getHeaders(),
      timeout: 15000,
    });

    return res.json({ success: true, data: aiResponse.data });
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({
        success: false,
        message: 'AI face detection service is unavailable.',
      });
    }
    next(error);
  }
};
