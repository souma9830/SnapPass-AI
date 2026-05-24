import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "processed", "failed"],
      default: "uploaded",
      index: true,
    },
    lastError: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

uploadSchema.index({ user: 1, createdAt: -1 });

const Upload = mongoose.model("Upload", uploadSchema);

export default Upload;
