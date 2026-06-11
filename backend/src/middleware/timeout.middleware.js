/**
 * Request timeout middleware for Express.
 * Responds with a 504 Gateway Timeout error if the request takes longer than the specified limit.
 * @param {number} ms - Timeout in milliseconds.
 */
export const requestTimeout = (ms = 15000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        const err = new Error('Request Timeout: The server took too long to respond.');
        err.statusCode = 504;
        next(err);
      }
    }, ms);

    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    next();
  };
};
