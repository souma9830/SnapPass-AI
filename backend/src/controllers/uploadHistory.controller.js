import Upload from '../models/upload.model.js';

export const getHistory = async (req, res, next) => {
  try {
    const history = await Upload.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};

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
    const filter = {};

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
      Upload.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Upload.countDocuments(filter),
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
