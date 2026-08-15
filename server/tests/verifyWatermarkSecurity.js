const watermarkEngine = require('../services/watermarkSecurityEngine');

console.log('Testing Watermark Security Engine...');

const token = watermarkEngine.generateWatermarkToken('photo-123', 'tenant-456');
console.log('Generated Token:', token);

if (!token.signature || !token.watermarkHeader) {
  console.error('FAILED: Invalid token structure');
  process.exit(1);
}

const verification = watermarkEngine.verifyWatermarkToken(
  'photo-123',
  'tenant-456',
  token.timestamp,
  token.signature
);

if (verification.isValid) {
  console.log('SUCCESS: Watermark signature verified cleanly!');
} else {
  console.error('FAILED: Watermark signature failed verification');
  process.exit(1);
}
