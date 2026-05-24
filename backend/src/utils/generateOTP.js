import crypto from "crypto";

/**
 * @description Generate a 6-digit OTP and return it as a string using CSPRNG.
 * @returns {string} 6-digit OTP (may include leading zeros)
 */
export function generateOTP() {
  const num = crypto.randomInt(0, 1_000_000); // 0..999999 securely
  return String(num).padStart(6, '0');
}
