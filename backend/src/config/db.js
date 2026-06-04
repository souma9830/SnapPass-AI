import mongoose from "mongoose";
import { config } from "./config.js";

const MAX_RETRIES = 5;
let retryCount = 0;

const connectDatabase = async () => {
  const mongoUri = config.MONGO_URI;

  mongoose.connection.on("connected", () => {
    console.log("🟢 MongoDB connected successfully");
    retryCount = 0; // Reset retries on success
  });

  mongoose.connection.on("error", (error) => {
    console.error("🔴 MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
  });

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
    } catch (err) {
      retryCount++;
      if (retryCount <= MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 15000);
        console.warn(`⚠️ MongoDB connection failed. Retrying in ${delay / 1000}s (${retryCount}/${MAX_RETRIES})...`);
        setTimeout(connectWithRetry, delay);
      } else {
        console.error("🚨 MongoDB maximum reconnection attempts reached. Exiting process.");
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};

export default connectDatabase;
