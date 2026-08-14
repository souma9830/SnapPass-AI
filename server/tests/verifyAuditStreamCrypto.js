const AuditStreamCryptoVerifier = require('../utils/auditStreamCryptoVerifier');

function runAuditStreamCryptoTests() {
  console.log('--- Testing AuditStreamCryptoVerifier ---');
  const verifier = new AuditStreamCryptoVerifier('secret_test_key_123');

  // Test 1: Event signing and chain building
  const event1 = verifier.signEvent({ action: 'USER_LOGIN', userId: 'user_1' });
  const event2 = verifier.signEvent({ action: 'PHOTO_UPLOAD', userId: 'user_1', details: { file: 'test.jpg' } });
  
  const chain = [event1, event2];
  const initialVerify = verifier.verifyChain(chain);
  
  if (!initialVerify.isValid) {
    throw new Error(`Chain verification failed unexpectedly: ${initialVerify.reason}`);
  }
  console.log('✓ Test 1 Passed: Valid chain signed and verified');

  // Test 2: Detecting tampered payload
  const tamperedChain = [
    event1,
    { ...event2, details: { file: 'hacked.jpg' } } // Modified payload without updating hash
  ];
  const tamperedVerify = verifier.verifyChain(tamperedChain);
  
  if (tamperedVerify.isValid) {
    throw new Error('Chain verification failed to detect tampered event payload!');
  }
  console.log('✓ Test 2 Passed: Tampered event payload successfully caught');

  console.log('All AuditStreamCryptoVerifier tests passed successfully!');
}

runAuditStreamCryptoTests();
