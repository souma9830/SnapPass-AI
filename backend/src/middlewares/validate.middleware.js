/**
 * Validate Middleware
 * Simple request validation helpers used in routes.
 */

/**
 * Validates that a photo file was attached to the upload request.
 */
const validateUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Photo file is required.",
    });
  }
  next();
};

module.exports = { validateUpload };
