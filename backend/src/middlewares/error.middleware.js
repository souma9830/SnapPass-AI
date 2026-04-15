/**
 * Error Middleware
 * Provides 404 and global error handling for the Express app.
 */

/**
 * 404 — Route not found handler
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Global error handler
 * Formats all errors into a consistent JSON response.
 */
const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.status || err.statusCode || 500;

  // Multer-specific error messages
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File too large. Maximum size is 10 MB.",
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
