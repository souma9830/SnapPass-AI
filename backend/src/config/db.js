import mongoose from "mongoose";
import { config } from "./config.js";
const connectDatabase = async () => {
  const mongoUri = config.MONGO_URI;

  if (mongoUri === "mock" || !mongoUri) {
    console.log("\n=========================================================================");
    console.log("⚙️  FORCING OFFLINE MOCK MODE (Zero Hassle & No Database Needed!)");
    console.log("   You can now test the Admin Dashboard, login, search, and view settings");
    console.log("   instantly without running any database servers or altering DNS.");
    console.log("=========================================================================\n");
    global.USE_MOCK_DB = true;
    return;
  }

  mongoose.connection.on("connected", () => {
    console.log("🚀 MongoDB connected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });
  } catch (error) {
    console.log("\n=========================================================================");
    console.log("⚠️  Could not connect to MongoDB (DNS/Network restrictions or offline).");
    console.log("⚙️  ACTIVATING OFFLINE MOCK MODE (Zero Hassle & No Database Needed!)");
    console.log("   You can now test the Admin Dashboard, login, search, and view settings");
    console.log("   instantly without running any database servers or altering DNS.");
    console.log("=========================================================================\n");
    global.USE_MOCK_DB = true;
  }
};

export default connectDatabase;
