/**
 * Standard API response helpers.
 */
export const sendSuccess = (res, data, message = 'Success') => {
  res.status(200).json({ success: true, message, data });
};

export const sendError = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({ success: false, message, error });
};
