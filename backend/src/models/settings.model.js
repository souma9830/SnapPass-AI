import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    maxFileSizeBytes: {
      type: Number,
      required: true,
      default: 10 * 1024 * 1024,
    },
    allowedMimeTypes: {
      type: [String],
      required: true,
      default: ["image/jpeg", "image/png", "image/webp"],
    },
    uploadDir: {
      type: String,
      required: true,
      default: "uploads",
    },
    corsOrigin: {
      type: String,
      required: true,
      default: "http://localhost:5173",
    },
    aiServiceUrl: {
      type: String,
      required: true,
      default: "http://localhost:8000",
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
