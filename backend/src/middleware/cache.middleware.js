import {
  isRedisAvailable,
  getCache,
  setCache,
  deleteCache,
} from '../config/redis.js';

const memoryCache = new Map();

export const cacheMiddleware = (durationSeconds = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = `cache:${req.originalUrl || req.url}`;

    if (isRedisAvailable()) {
      const cached = await getCache(key);
      if (cached) return res.json(cached);
    } else {
      const cached = memoryCache.get(key);
      if (cached && Date.now() < cached.expiredAt) return res.json(cached.data);
      if (cached) memoryCache.delete(key);
    }

    const originalJson = res.json;
    res.json = function (body) {
      if (isRedisAvailable()) {
        setCache(key, body, durationSeconds);
      } else {
        memoryCache.set(key, {
          data: body,
          expiredAt: Date.now() + durationSeconds * 1000,
        });
      }
      return originalJson.call(this, body);
    };

    next();
  };
};

export const invalidateCache = async (pattern) => {
  if (isRedisAvailable()) {
    try {
      const { redisClient } = await import('../config/redis.js');
      const r = redisClient;
      if (r) {
        let cursor = '0';
        do {
          const reply = await r.scan(cursor, { MATCH: pattern, COUNT: 100 });
          cursor = reply.cursor;
          if (reply.keys.length > 0) await r.del(reply.keys);
        } while (cursor !== 0);
      }
    } catch (err) {
      console.error('[Cache] Invalidation error:', err.message);
    }
  } else {
    const prefix = pattern.replace('*', '');
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) memoryCache.delete(key);
    }
  }
};
