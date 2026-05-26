// backend/src/seed/createAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
// No manual hash; password will be hashed by User pre‑save hook
import User from "../models/user.model.js";

dotenv.config();

const run = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

      // Remove any existing admin and recreate
      const existing = await User.findOne({ email: "admin@snappass.ai" });
      if (existing) {
        await User.deleteOne({ email: "admin@snappass.ai" });
        console.log("⚠️ Existing admin removed – recreating");
      }

    // Create the admin user
    const admin = new User({
      fullName: "Admin",
      email:    "admin@snappass.ai",
      password: "AdminPass123!",
      role:     "admin",
    });

    await admin.save();
    console.log("🚀 Admin user created successfully:");
    console.log(admin);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();