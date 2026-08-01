import dotenv from 'dotenv';
import { resolvePort } from '../utils/portValidator.js';

dotenv.config();

export const config = {
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
    NODE_ENV: process.env.NODE_ENV || "development",
    port: resolvePort(process.env.PORT, 3000),
    aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
    MONGO_URI: process.env.MONGO_URI,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB default
    RETENTION_MAX_AGE_MS: parseInt(process.env.RETENTION_MAX_AGE_MS, 10) || 24 * 60 * 60 * 1000,
    UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
    upload: {
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    WEBHOOK_URL: process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhook-test',
}