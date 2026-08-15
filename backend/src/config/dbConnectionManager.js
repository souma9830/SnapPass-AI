/**
 * dbConnectionManager.js — MongoDB Connection Manager
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import mongoose from 'mongoose';

export class DbConnectionManager {
  static async connectWithRetry(mongoUri, maxRetries = 5) {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB connected successfully.');
        return;
      } catch (err) {
        attempts++;
        console.error(`MongoDB connection attempt ${attempts} failed:`, err.message);
        if (attempts >= maxRetries) throw err;
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
  }
}
