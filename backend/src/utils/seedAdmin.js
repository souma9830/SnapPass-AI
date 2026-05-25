import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Settings from "../models/settings.model.js";
import connectDatabase from "../config/db.js";

dotenv.config();

async function seed() {
  try {
    console.log("Connecting to database...");
    await connectDatabase();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@snappass.ai";
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
    const adminName = "Default Administrator";

    console.log(`Checking if admin user exists: ${adminEmail}`);
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log("Creating default admin user...");
      admin = await User.create({
        fullName: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        isActive: true,
      });
      console.log(`✅ Default admin created successfully!`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log("ℹ️ Admin user already exists.");
    }

    console.log("Checking if default settings doc exists...");
    let settings = await Settings.findOne();
    if (!settings) {
      console.log("Creating default settings doc...");
      await Settings.create({});
      console.log("✅ Default settings created successfully!");
    } else {
      console.log("ℹ️ Default settings already exist.");
    }

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

seed();
