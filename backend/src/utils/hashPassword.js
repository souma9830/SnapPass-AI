// backend/src/utils/hashPassword.js
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash a plaintext password using bcrypt.
 * @param {string} password - Plain‑text password supplied by the user.
 * @returns {Promise<string>} The bcrypt hash to store in the DB.
 */
export async function hashPassword(password) {
  if (typeof password !== "string") {
    throw new Error("Password must be a string");
  }
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a plaintext password against a stored bcrypt hash.
 * @param {string} password - Plain‑text password to verify.
 * @param {string} hash - The stored bcrypt hash.
 * @returns {Promise<boolean>} True if the password matches the hash.
 */
export async function verifyPassword(password, hash) {
  if (typeof password !== "string" || typeof hash !== "string") {
    throw new Error("Both password and hash must be strings");
  }
  return await bcrypt.compare(password, hash);
}
