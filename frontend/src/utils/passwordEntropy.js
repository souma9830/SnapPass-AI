/**
 * passwordEntropy — client-side password strength evaluation and
 * cryptographic salt generation utilities.
 *
 * All logic runs locally (Shannon entropy + crypto.getRandomValues) so
 * password material never needs to be transmitted for validation.
 */

export const STRENGTH_KEYS = ['weak', 'medium', 'strong', 'excellent'];

export const calculateEntropy = (password = '') => {
  if (!password || password.length === 0) return 0;

  const frequency = {};
  for (const char of password) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  const length = password.length;
  let perSymbolEntropy = 0;
  for (const count of Object.values(frequency)) {
    const probability = count / length;
    perSymbolEntropy -= probability * Math.log2(probability);
  }

  return perSymbolEntropy * length;
};

export const getPasswordStrength = (password = '') => {
  const entropy = calculateEntropy(password);
  const length = password.length;

  let score;
  if (!password) {
    score = 0;
  } else if (entropy < 20 || length < 8) {
    score = 1;
  } else if (entropy < 50) {
    score = 2;
  } else if (entropy < 80) {
    score = 3;
  } else {
    score = 4;
  }

  return {
    score,
    entropy,
    label: score > 0 ? STRENGTH_KEYS[score - 1] : '',
  };
};

export const evaluatePasswordStrength = async (password = '') =>
  getPasswordStrength(password);

export const generateSalt = (byteLength = 16) => {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const appendSalt = (password = '', salt = '') =>
  salt ? `${password}.${salt}` : password;

export const generateStrongPassword = (length = 16) => {
  const charset =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_+-=';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += charset[bytes[i] % charset.length];
  }
  return result;
};
