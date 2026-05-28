// admin.controller.js
// Provides admin-related data such as dashboard statistics.

import Upload from "../models/upload.model.js";
import ProcessedImage from "../models/processedImage.model.js";
import User from "../models/user.model.js";
import Settings from "../models/settings.model.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalUploads, totalProcessed, totalUsers] = await Promise.all([
      Upload.countDocuments(),
      ProcessedImage.countDocuments({ status: "completed" }),
      User.countDocuments(),
    ]);

    // Aggregate uploads for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const uploadsHistory = await Upload.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "processed"] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const stats = {
      totalUploads,
      totalProcessedImages: totalProcessed,
      totalUsers,
      history: uploadsHistory,
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getRecentUploads = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const uploads = await Upload.find().sort({ createdAt: -1 }).limit(limit);
    
    const formattedUploads = uploads.map((u) => ({
      id: u._id,
      name: u.originalName,
      size: (u.sizeBytes / 1024).toFixed(1) + ' KB',
      preset: "Standard", // Placeholder since preset isn't saved in this schema yet
      background: "White", // Placeholder 
      createdAt: u.createdAt,
      status: u.status,
    }));

    res.json({ success: true, uploads: formattedUploads });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        serviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
        maxUploadSize: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) / (1024 * 1024) : 10,
        presets: ['Standard Passport', 'US Visa', 'EU Schengen'],
        maintenanceMode: false
      });
    }
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { serviceUrl, maxUploadSize, presets, maintenanceMode } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    if (serviceUrl !== undefined) settings.serviceUrl = serviceUrl;
    if (maxUploadSize !== undefined) settings.maxUploadSize = maxUploadSize;
    if (presets !== undefined) settings.presets = presets;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    
    await settings.save();
    
    res.json({ success: true, message: "Settings updated successfully", settings });
  } catch (error) {
    next(error);
  }
};
