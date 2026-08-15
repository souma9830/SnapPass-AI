import { memoryCache } from '../utils/memoryCache.js';

export const routeCacheMiddleware = (ttlSeconds) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedData = memoryCache.get(key);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    res.originalSendJson = res.json;
    res.json = (body) => {
      memoryCache.set(key, body, ttlSeconds);
      res.originalSendJson(body);
    };
    next();
  };
};
