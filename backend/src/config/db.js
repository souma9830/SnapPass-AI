import mongoose from "mongoose";
import { config } from "./config.js";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDatabase = async (retryCount = 0) => {
  const mongoUri = config.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI not configured. Skipping database connection.");
    return;
  }

  mongoose.connection.on("connected", () => {
    console.log("✓ MongoDB connected successfully");
  });

  mongoose.connection.on("error", (error) => {
    console.error("✗ MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠ MongoDB disconnected");
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });

  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.warn(
        `MongoDB connection attempt ${retryCount + 1}/${MAX_RETRIES} failed. Retrying in ${RETRY_DELAY_MS / 1000}s...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDatabase(retryCount + 1);
    }
    console.error("✗ All MongoDB connection attempts failed:", error.message);
    throw error;
  }
};

export default connectDatabase;
