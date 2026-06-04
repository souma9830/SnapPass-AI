export function validateEnv() {
  const required = [
    'MONGO_URI',
    'JWT_SECRET',
    'RESEND_API_KEY',
    'EMAIL_FROM'
  ];

  const isTest = process.env.NODE_ENV === 'test';
  if (isTest) return;

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ CRITICAL CONFIGURATION ERROR: Missing required environment variables:');
    missing.forEach(key => {
      console.error(`  -> ${key} must be specified in the environment`);
    });
    process.exit(1);
  }
}
