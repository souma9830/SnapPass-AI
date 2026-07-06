import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { config } from './config/config.js';
import errorMiddleware from './middleware/error.middleware.js';
import { requestId } from './middleware/requestId.middleware.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { auditMiddleware } from './middleware/audit.middleware.js';
import apiRoutes, { healthRoutes } from './routes/index.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: config.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(requestId);
app.use(loggerMiddleware);
app.use(auditMiddleware);

app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.use('/api', apiRoutes);
app.use(healthRoutes);

app.use(errorMiddleware);

export default app;
