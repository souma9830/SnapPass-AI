import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/config.js";

let isConfigured = false;

const ensureConfigured = () => {
  if (isConfigured) return;

  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary configuration is missing in environment variables.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  isConfigured = true;
};

export const uploadImage = async (filePath, options = {}) => {
  ensureConfigured();
  return cloudinary.uploader.upload(filePath, {
    resource_type: "image",
    folder: "snappass/uploads",
    ...options,
  });
};
