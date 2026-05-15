/**
 * App configuration loaded from environment variables.
 * Centralised so controllers and services import from one place.
 */
import dotenv from 'dotenv';
dotenv.config();
export default {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:8000",

  upload: {
    dir: process.env.UPLOAD_DIR || "uploads",
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  // Database config — ready for MongoDB integration
  // db: {
  //   uri: process.env.MONGO_URI || "mongodb://localhost:27017/snappass",
  // },
};
