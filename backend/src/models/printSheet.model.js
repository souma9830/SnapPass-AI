import mongoose from "mongoose";
import { PHOTO_SIZE_PRESETS } from "../controllers/presets.controller.js";

const printSheetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    processedImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProcessedImage",
      required: true,
      index: true,
    },
    photoSizePreset: {
      type: String,
      enum: PHOTO_SIZE_PRESETS,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },
    sheetFormat: {
      type: String,
      enum: ["A4"],
      default: "A4",
    },
    outputUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["queued", "generating", "generated", "failed"],
      default: "queued",
      index: true,
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

printSheetSchema.index({ user: 1, createdAt: -1 });

const PrintSheet = mongoose.model("PrintSheet", printSheetSchema);

export default PrintSheet;
