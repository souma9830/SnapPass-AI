import UploadHistory from '../models/UploadHistory.js';

export const getUserUploadHistory = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      startDate,
      endDate,
    } = req.query;
    // Scope every query to the authenticated user to prevent IDOR: without
    // this, any logged-in user could page through every user's upload records.
    const filter = { user: req.user.id };

    if (search) {
      filter.$or = [
        { filename: { $regex: search, $options: 'i' } },
        { originalImage: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      UploadHistory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      UploadHistory.countDocuments(filter),
    ]);

    res.json({
      success: true,
      history: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};
