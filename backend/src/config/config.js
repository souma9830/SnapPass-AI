import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}
export const config = {
    port: process.env.PORT || 3000,
    aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
    MONGO_URI: process.env.MONGO_URI,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB default
    UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
    upload: {
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    },
}