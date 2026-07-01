/**
 * Upload History Controller
 * Returns the authenticated user's uploaded + processed passport images.
 */

import UploadHistory from '../models/UploadHistory.js';

export const getUserUploadHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const history = await UploadHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const mapped = history.map((h) => {
      const originalName = h.originalImage ? h.originalImage.split('/').pop() : null;
      const processedName = h.processedImage ? h.processedImage.split('/').pop() : null;


      return {
        id: h._id,
        uploadedAt: h.createdAt,
        originalImage: h.originalImage,
        processedImage: h.processedImage,
        originalFileName: originalName,
        processedFileName: processedName,
        presetSize: h.presetSize,
        status: h.status,
        backgroundColor: h.backgroundColor,
      };
    });

    res.json({ success: true, data: mapped });
  } catch (error) {
    next(error);
  }
};

