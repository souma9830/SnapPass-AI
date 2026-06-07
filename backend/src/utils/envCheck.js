import logger from './logger.js';

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

  if (missing.length > 0) {
    console.error('\n================================================================');
    console.error('⚠️  CRITICAL ERROR: MISSING ENVIRONMENT VARIABLES');
    console.error('================================================================');
    for (const item of missing) {
      console.error(`  - ${item.key}: ${item.desc}`);
    }
    console.error('----------------------------------------------------------------');
    console.error('Please configure these keys in your backend .env file.');
    console.error('See backend/.env.example for details.');
    console.error('================================================================\n');
    
    // In production, exit immediately to prevent corrupted container boots
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      logger.warn('Running with missing credentials. Some backend operations will fail.');
    }
  }
}
