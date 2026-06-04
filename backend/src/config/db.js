import mongoose from "mongoose";
import { config } from "./config.js";
import logger from "../utils/logger.js";
const connectDatabase = async () => {
  const mongoUri = config.MONGO_URI;

  // basic error handling, Update it later. 
  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connected");
  });

  mongoose.connection.on("error", (error) => {
    logger.error(`MongoDB connection error: ${error.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  await mongoose.connect(mongoUri);
};

export default connectDatabase;
