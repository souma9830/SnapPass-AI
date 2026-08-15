import crypto from 'crypto';

export const validateFileHeaders = (buffer) => {
  const magic = buffer.toString('hex', 0, 4);
  return ['89504e47', 'ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'].includes(magic);
};

/**
 * @description Generate a 6-digit OTP and return it as a string using CSPRNG.
 * @returns {string} 6-digit OTP
 */
export function generateOTP() {
  const num = crypto.randomInt(0, 1_000_000); // 0..999999 securely
  return String(num).padStart(6, '0');
}