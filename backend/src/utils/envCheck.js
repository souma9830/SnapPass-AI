import logger from './logger.js';

const KNOWN_DEFAULT_JWT_SECRET = 'snappass_dev_secret_key_change_in_production';

/**
 * Validates that all required environment variables are configured.
 * Prints clean developer-friendly error blocks.
 */
export function verifyEnvironment() {
  const required = [
    { key: 'MONGO_URI', desc: 'MongoDB connection string (e.g. mongodb://localhost:27017/snappass)' },
    { key: 'JWT_SECRET', desc: 'Secret key for signing JSON Web Tokens' },
    { key: 'RESEND_API_KEY', desc: 'API key from Resend for transactional email notifications' },
    { key: 'EMAIL_FROM', desc: 'Sender email address verified in Resend' }
  ];

  const missing = [];

  for (const item of required) {
    if (!process.env[item.key]) {
      missing.push(item);
    }
  }

  // The JWT_SECRET fallback in config.js is a public, repo-known value, so
  // ANY deployment without a real JWT_SECRET (missing or still the default)
  // lets anyone forge valid session JWTs, including admin ones (#1448).
  // Reject both cases in EVERY environment, not just production.
  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET === KNOWN_DEFAULT_JWT_SECRET
  ) {
    missing.push({
      key: 'JWT_SECRET',
      desc: process.env.JWT_SECRET === KNOWN_DEFAULT_JWT_SECRET
        ? `Set to the known repo-default value; anyone can forge JWTs with it (${KNOWN_DEFAULT_JWT_SECRET})`
        : 'Missing; config.js falls back to a public secret that allows forging JWTs'
    });
  }

  if (missing.length > 0) {
    console.error('\n================================================================');
    console.error('⚠️  CRITICAL ERROR: MISSING OR INSECURE ENVIRONMENT VARIABLES');
    console.error('================================================================');
    for (const item of missing) {
      console.error(`  - ${item.key}: ${item.desc}`);
    }
    console.error('----------------------------------------------------------------');
    console.error('Please configure these keys in your backend .env file.');
    console.error('See backend/.env.example for details.');
    console.error('================================================================\n');
    
    // A missing/public JWT_SECRET is a credential compromise in any
    // environment, so exit instead of continuing (missing JWTs were
    // previously tolerated outside production).
    if (process.env.NODE_ENV === 'production' || missing.some(m => m.key === 'JWT_SECRET')) {
      process.exit(1);
    } else {
      logger.warn('Running with missing credentials. Some backend operations will fail.');
    }
  }
}
