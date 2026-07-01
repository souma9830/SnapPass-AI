import { requestId } from './middleware/requestId.middleware.js';
import express from 'express';
import { config } from './config/config.js';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import { fileURLToPath } from 'url';
import os from 'os';

import uploadRoutes from './routes/upload.routes.js';
import uploadHistoryRoutes from './routes/uploadHistory.routes.js';
import imageRoutes from './routes/image.routes.js';
import processRoutes from './routes/process.routes.js';


import printRoutes from './routes/print.routes.js';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import complianceRoutes from './routes/compliance.routes.js';

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
app.use(requestId);
app.use('/api', apiLimiter);


// Disable X-Powered-By header to prevent technology disclosure
app.disable("x-powered-by");

app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
            connectSrc: ["'self'", config.aiServiceUrl],
            frameAncestors: ["'none'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xContentTypeOptions: true,
    xDnsPrefetchControl: { allow: false },
    xDownloadOptions: { enabled: true },
    xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
}));

// Custom security headers not covered by helmet
app.use((_req, res, next) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    next();
});
const allowedOrigins = config.CORS_ORIGIN ? config.CORS_ORIGIN.split(',').map(o => o.trim()) : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*')) {
        return callback(null, origin);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy: origin not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id']
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput);
app.use(hpp());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "SnapPass AI Backend API", message: "Welcome to the API" });
});

// Serve security.txt for vulnerability disclosure
app.get("/.well-known/security.txt", (_req, res) => {
  res.type("text/plain").send(`# Security Contact
# SnapPass AI takes security seriously.
# Please report vulnerabilities responsibly.

Contact: mailto:security@snappass.ai
Contact: https://github.com/souma9830/SnapPass-AI/security/advisories/new
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en
Canonical: https://github.com/souma9830/SnapPass-AI/.well-known/security.txt
Policy: https://github.com/souma9830/SnapPass-AI/blob/master/SECURITY.md
`);
});

// Serve robots.txt
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Crawl-delay: 10
`);
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "SnapPass AI Backend",
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    system: {
      platform: os.platform(),
      arch: os.arch(),
      freemem: os.freemem(),
      totalmem: os.totalmem(),
      loadavg: os.loadavg()
    }
  });
});

// API Version 1 Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/upload-history", uploadHistoryRoutes);
app.use("/api/v1/process", imageRoutes);
app.use("/api/v1/process", processRoutes);

app.use("/api/v1/print", printRoutes);


app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/testimonials", testimonialRoutes);
app.use("/api/v1/compliance", complianceRoutes);


// Legacy backward-compatibility routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/upload-history", uploadHistoryRoutes);
app.use("/api/process", imageRoutes);
app.use("/api/process", processRoutes);

app.use("/api/print", printRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/compliance", complianceRoutes);



app.use((req, _res, next) => {
   const error = new Error(`Route not found: ${req.originalUrl}`);
   error.statusCode = 404;
   next(error);
});


app.get("/metrics", (_req, res) => {
    res.set("Content-Type", "text/plain");
    res.send("# HELP http_requests_total Total number of HTTP requests\n# TYPE http_requests_total counter\nhttp_requests_total 1\n");
});

app.use(errorMiddleware);

export default app;
