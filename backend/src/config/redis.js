import { createClient } from "redis";

let redisClient = null;
let redisAvailable = false;

const RECONNECT_DELAY_MS = 5000;
let reconnectTimer = null;

const initializeRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.warn(
      "[Redis] REDIS_URL not configured. Caching disabled - all requests pass through without cache."
    );
    return;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.warn("[Redis] Max reconnect attempts reached. Caching disabled.");
            return false;
          }
          return Math.min(retries * 500, 5000);
        },
      },
    });

    redisClient.on("error", (err) => {
      if (redisAvailable) {
        console.warn("[Redis] Connection lost:", err.message, "- caching disabled until reconnect.");
        redisAvailable = false;
      }
    });

    redisClient.on("ready", () => {
      if (!redisAvailable) {
        console.log("[Redis] Connected successfully. Caching enabled.");
        redisAvailable = true;
      }
    });

    redisClient.on("end", () => {
      redisAvailable = false;
    });

    await redisClient.connect();
    redisAvailable = true;
    console.log("[Redis] Client connected successfully.");
  } catch (err) {
    console.warn(
      `[Redis] Failed to connect: ${err.message}. Backend will run without caching.`
    );
    redisClient = null;
    redisAvailable = false;
  }
};

initializeRedis();

export const isRedisAvailable = () => redisAvailable;

export const getCache = async (key) => {
  if (!redisClient || !redisAvailable) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("[Redis] get error:", err.message);
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 300) => {
  if (!redisClient || !redisAvailable) return;
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (err) {
    console.error("[Redis] set error:", err.message);
  }
};

export const deleteCache = async (key) => {
  if (!redisClient || !redisAvailable) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error("[Redis] delete error:", err.message);
  }
};
