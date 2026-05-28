import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    serviceUrl: {
      type: String,
      trim: true,
      default: "http://localhost:8000",
    },
    maxUploadSize: {
      type: Number,
      default: 10, // Default 10MB
    },
    presets: {
      type: [String],
      default: ["Standard Passport", "US Visa", "EU Schengen"],
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
