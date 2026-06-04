import dotenv from 'dotenv';
import { validateEnv } from './validateEnv.js';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

if (!isTest) {
    validateEnv();
}

export const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
    MONGO_URI: process.env.MONGO_URI || (isTest ? "mongodb://localhost:27017/snappass_test" : ""),
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB default
    UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
    upload: {
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    },
    JWT_SECRET: process.env.JWT_SECRET || (isTest ? "test_secret_key" : ""),
    RESEND_API_KEY: process.env.RESEND_API_KEY || (isTest ? "re_test_key" : ""),
    EMAIL_FROM: process.env.EMAIL_FROM || (isTest ? "test@snappass.ai" : ""),
}