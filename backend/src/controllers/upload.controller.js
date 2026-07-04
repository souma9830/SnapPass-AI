import path from 'path';

export const uploadPhoto = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      file: req.file ? req.file.filename : null
    });
  } catch (err) {
    next(err);
  }
};