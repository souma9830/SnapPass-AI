const memoryCache = new Map();

/**
 * cacheMiddleware - caching middleware for static or heavy API responses.
 * @param {number} durationSeconds - cache duration in seconds.
 */
export const cacheMiddleware = (durationSeconds = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = memoryCache.get(key);

    if (cachedResponse) {
      const { data, expiredAt } = cachedResponse;
      if (Date.now() < expiredAt) {
        return res.json(data);
      } else {
        memoryCache.delete(key);
      }
    }

    // Wrap res.json to intercept and cache the response data
    const originalJson = res.json;
    res.json = function (body) {
      memoryCache.set(key, {
        data: body,
        expiredAt: Date.now() + durationSeconds * 1000,
      });
      return originalJson.call(this, body);
    };

    next();
  };
};
