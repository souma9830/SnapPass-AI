import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/blacklistedToken.model.js";

/**
 * Blacklist a JWT token.
 * @param {string} token 
 */
export async function blacklistToken(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      // If the token doesn't have an expiration time, use a default 24h expiration
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await BlacklistedToken.create({ token, expiresAt });
      return;
    }

    // Convert exp (seconds) to Date
    const expiresAt = new Date(decoded.exp * 1000);
    // Add to database. If it's already there (duplicate key), ignore it.
    await BlacklistedToken.findOneAndUpdate(
      { token },
      { token, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    console.error("Error blacklisting token:", error);
  }
}

/**
 * Check if a JWT token has been blacklisted.
 * @param {string} token 
 * @returns {Promise<boolean>}
 */
export async function isTokenBlacklisted(token) {
  try {
    const record = await BlacklistedToken.findOne({ token });
    return !!record;
  } catch (error) {
    console.error("Error checking token blacklist status:", error);
    return false;
  }
}
