import Upload from '../models/upload.model.js';

export const getHistory = async (req, res, next) => {
  try {
    const history = await Upload.find().sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};