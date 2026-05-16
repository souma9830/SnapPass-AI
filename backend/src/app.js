/**
 * SnapPass AI - Express App
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import uploadRoutes from './routes/upload.routes.js';
import imageRoutes from './routes/image.routes.js';
import printRoutes from './routes/print.routes.js';

import errorMiddleware from './middleware/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "SnapPass AI Backend", timestamp: new Date() });
});

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
