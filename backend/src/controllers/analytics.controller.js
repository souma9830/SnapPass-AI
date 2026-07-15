import Upload from '../models/upload.model.js';
import User from '../models/user.model.js';
import PrintSheet from '../models/printSheet.model.js';
import ProcessedImage from '../models/processedImage.model.js';
import { successResponse, errorResponse } from '../utils/httpResponse.js';

export async function getDashboardStats(req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUploads,
      todayUploads,
      totalUsers,
      totalSheets,
      totalProcessed,
      recentUploads,
    ] = await Promise.all([
      Upload.countDocuments(),
      Upload.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments(),
      PrintSheet.countDocuments(),
      ProcessedImage.countDocuments(),
      Upload.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return successResponse(res, {
      stats: {
        totalUploads,
        todayUploads,
        totalUsers,
        totalSheets,
        totalProcessed,
      },
      recentUploads: recentUploads.map((u) => ({
        id: u._id,
        filename: u.filename,
        date: u.createdAt,
      })),
    }, 'Dashboard stats fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getUploadsByDay(req, res, next) {
  try {
    const { days = 7 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const pipeline = [
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const data = await Upload.aggregate(pipeline);
    return successResponse(res, data, 'Uploads by day fetched successfully');
  } catch (err) {
    next(err);
  }
}
