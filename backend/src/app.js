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
import { checkTokenBlacklist } from './middleware/blacklist.middleware.js';
import { timingMiddleware } from './middleware/timing.middleware.js';
import { telemetryContextMiddleware } from './middleware/telemetryContext.middleware.js';
import { apiRateLimiter } from './middleware/rateLimiter.middleware.js';
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
// Limit incoming request payload size to prevent DOS attacks before sanitization runs
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(requestId);
app.use(loggerMiddleware);
// Mount database session audit logger middleware
app.use(auditMiddleware);
app.use(timingMiddleware);
app.use(telemetryContextMiddleware);

// Serve uploaded files statically for frontend canvas access
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Route groups for all backend resources and authentication APIs
app.use('/api', apiRateLimiter, apiRoutes);
app.use(healthRoutes);

// 404 Handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorMiddleware);

export default app;
