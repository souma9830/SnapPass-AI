import mongoose from "mongoose";
import { PHOTO_SIZE_PRESETS } from "../controllers/presets.controller.js";

const processedImageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upload: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upload",
      required: true,
      index: true,
    },
    backgroundColour: {
      type: String,
      enum: ["white", "light_blue", "grey", "custom"],
      default: "white",
    },
    photoSizePreset: {
      type: String,
      enum: PHOTO_SIZE_PRESETS,
      required: true,
    },
    outputUrl: {
      type: String,
      required: true,
      trim: true,
    },
    widthPx: {
      type: Number,
      min: 1,
    },
    heightPx: {
      type: Number,
      min: 1,
    },
    dpi: {
      type: Number,
      min: 1,
    },
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
      index: true,
    },
    processingTimeMs: {
      type: Number,
      min: 0,
    },
    errorMessage: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

processedImageSchema.index({ user: 1, upload: 1, createdAt: -1 });

const ProcessedImage = mongoose.model("ProcessedImage", processedImageSchema);

export default ProcessedImage;
