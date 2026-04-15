/**
 * SnapPass AI — Express Entry Point
 * Bootstraps the Express server, applies global middleware, and mounts route groups.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const uploadRoutes = require("./routes/upload.routes");
const imageRoutes = require("./routes/image.routes");
const printRoutes = require("./routes/print.routes");

const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Parsing Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static File Serving (uploaded images) ─────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ── Health Check ───────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "SnapPass AI Backend", timestamp: new Date() });
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use("/api/upload", uploadRoutes);
app.use("/api/process", imageRoutes);
app.use("/api/print", printRoutes);

// ── Global Error Handlers ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  SnapPass AI backend running on http://localhost:${PORT}`);
  console.log(`🤖  AI Service URL: ${process.env.AI_SERVICE_URL}`);
});

module.exports = app;
