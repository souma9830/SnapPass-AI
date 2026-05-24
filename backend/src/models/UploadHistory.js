// Basic upload scheme  to track a user's generated passport photos.
import mongoose from "mongoose";

const uploadHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalImage: {
      type: String,
      required: true,
    },
    processedImage: {
      type: String,
    },
    presetSize: {
      type: String,
      enum: ["35x45", "51x51", "33x48", "40x60", "2x2in"], // according to size mentioned in readme.
      required: true,
    },
    backgroundColor: {
      type: String,
      enum: ["white", "off-white", "light-gray", "light-blue", "light-red"],
      default: "white",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const UploadHistory = mongoose.model("UploadHistory", uploadHistorySchema);

export default UploadHistory;
