import { createClient } from "redis";

let redisClient = null;

const initializeRedis = async () => {
  if (process.env.REDIS_URL) {
    try {
      redisClient = createClient({
        url: process.env.REDIS_URL,
      });

      redisClient.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });

      await redisClient.connect();
      console.log("Redis Client Connected Successfully");
    } catch (err) {
      console.error("Failed to initialize Redis client:", err.message);
      redisClient = null;
    }
  } else {
    console.log("REDIS_URL not configured. Redis caching will run in fallback mock mode.");
  }
};

// Initialize immediately
initializeRedis();

export const getCache = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Redis get cache error:", err);
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 300) => {
  if (!redisClient) return;
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (err) {
    console.error("Redis set cache error:", err);
  }
};

export const deleteCache = async (key) => {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error("Redis delete cache error:", err);
  }
};
