import express from 'express';
import { getStats, getRecentUploads, getSettings, updateSettings } from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = express.Router();

// Protected admin routes
router.get('/stats', authMiddleware, adminMiddleware, getStats);
router.get('/uploads', authMiddleware, adminMiddleware, getRecentUploads);
router.get('/settings', authMiddleware, adminMiddleware, getSettings);
router.put('/settings', authMiddleware, adminMiddleware, updateSettings);

export default router;
