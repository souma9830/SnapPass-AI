import express from 'express';
import { config } from './config/config.js';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import { fileURLToPath } from 'url';

import uploadRoutes from './routes/upload.routes.js';
import imageRoutes from './routes/image.routes.js';
import printRoutes from './routes/print.routes.js';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';

import errorMiddleware from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import logger from './utils/logger.js';
import { sanitizeInput } from './middleware/sanitize.middleware.js';

const localFilename = fileURLToPath(import.meta.url);
const localDirname = path.dirname(localFilename);

const app = express();

// Enable trust proxy for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Apply rate limiter to all API routes
app.use('/api', apiLimiter);


app.use(helmet());
const allowedOrigins = config.CORS_ORIGIN.split(',').map(o => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy: origin not allowed'));
    },
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);
app.use(hpp());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(localDirname, "..", "uploads")));

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "SnapPass AI Backend API", message: "Welcome to the API" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "SnapPass AI Backend", timestamp: new Date() });
});

// API Version 1 Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/process", imageRoutes);
app.use("/api/v1/print", printRoutes);
app.use("/api/v1/health", healthRoutes);

// Legacy backward-compatibility routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/process", imageRoutes);
app.use("/api/print", printRoutes);
app.use("/api/health", healthRoutes);

app.use((req, _res, next) => {
   const error = new Error(`Route not found: ${req.originalUrl}`);
   error.statusCode = 404;
   next(error);
});

app.use(errorMiddleware);

export default app;
