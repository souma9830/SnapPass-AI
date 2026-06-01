import express from 'express';
import { config } from './config/config.js';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import uploadRoutes from './routes/upload.routes.js';
import imageRoutes from './routes/image.routes.js';
import printRoutes from './routes/print.routes.js';
import authRoutes from './routes/auth.routes.js';

import errorMiddleware from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';

const localFilename = fileURLToPath(import.meta.url);
const localDirname = path.dirname(localFilename);

const app = express();

// Enable trust proxy for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Apply rate limiter to all API routes
app.use('/api', apiLimiter);


app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(localDirname, "..", "uploads")));

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "SnapPass AI Backend API", message: "Welcome to the API" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "SnapPass AI Backend", timestamp: new Date() });
});

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/process", imageRoutes);
app.use("/api/print", printRoutes);

app.use((req, _res, next) => {
   const error = new Error(`Route not found: ${req.originalUrl}`);
   error.statusCode = 404;
   next(error);
});

app.use(errorMiddleware);

export default app;
