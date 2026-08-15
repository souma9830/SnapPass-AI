/**
 * Compliance Controller
 * POST /api/compliance-check
 * Forwards { filename } to python-ai-service /check and returns a JSON checklist.
 */

import axios from 'axios';
import fs from 'fs';
import { config } from '../config/config.js';
import { resolveUploadPath } from '../utils/uploadPaths.utils.js';

export const complianceCheck = async (req, res, next) => {
  try {
    const { filename, sizePreset } = req.body || {};

    if (!filename || typeof filename !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'filename is required.' });
    }

    // Filename validation: keep aligned with image.controller.js
    const filenameRegex = /^[a-zA-Z0-9_\-\.]+$/;
    if (!filenameRegex.test(filename)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid filename format.' });
    }

    if (filename.startsWith('.') || path.basename(filename).startsWith('.')) {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Access denied: Hidden files are blocked.',
        });
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Access denied: Unsupported file extension.',
        });
    }

    const filePath = resolveUploadPath(filename);
    if (!filePath) {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Access denied: Path traversal detected.',
        });
    }

    // Existence check (also blocks directories/symlinks)
    let stats;
    try {
      stats = await fs.promises.lstat(filePath);
    } catch (e) {
      if (e && e.code === 'ENOENT') {
        return res
          .status(404)
          .json({ success: false, message: 'File not found on server.' });
      }
      throw e;
    }

    if (!stats.isFile() || stats.isSymbolicLink()) {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied: Invalid file type.' });
    }

    // Ensure python-ai-service has access to the same absolute path
    const response = await axios.post(
      `${config.aiServiceUrl}/check`,
      { file_path: filePath, size_preset: sizePreset },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const { computePassportComplianceScore } = await import('../utils/complianceRulesEngine.js');
    const complianceReport = computePassportComplianceScore(response.data?.checklist || response.data);

    return res.json({
      success: true,
      data: response.data,
      complianceScore: complianceReport
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message:
          'AI service is unavailable. Please ensure python-ai-service is running.',
      });
    }
    next(error);
  }
};

export const complianceAutoCorrect = async (req, res, next) => {
  try {
    const { filename, issue } = req.body || {};

    if (!filename || typeof filename !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'filename is required.' });
    }
    if (!issue || typeof issue !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'issue is required.' });
    }

    const filenameRegex = /^[a-zA-Z0-9_\-\.]+$/;
    if (!filenameRegex.test(filename)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid filename format.' });
    }

    if (filename.startsWith('.') || path.basename(filename).startsWith('.')) {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Access denied: Hidden files are blocked.',
        });
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Access denied: Unsupported file extension.',
        });
    }

    const filePath = resolveUploadPath(filename);
    if (!filePath) {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Access denied: Path traversal detected.',
        });
    }

    let stats;
    try {
      stats = await fs.promises.lstat(filePath);
    } catch (e) {
      if (e && e.code === 'ENOENT') {
        return res
          .status(404)
          .json({ success: false, message: 'File not found on server.' });
      }
      throw e;
    }

    if (!stats.isFile() || stats.isSymbolicLink()) {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied: Invalid file type.' });
    }

    const response = await axios.post(
      `${config.aiServiceUrl}/auto-correct`,
      { file_path: filePath, issue },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return res.json({ success: true, data: response.data });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message:
          'AI service is unavailable. Please ensure python-ai-service is running.',
      });
    }
    next(error);
  }
};
