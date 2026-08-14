const express = require('express');
const router = express.Router();
const AuditStreamCryptoVerifier = require('../utils/auditStreamCryptoVerifier');

const verifier = new AuditStreamCryptoVerifier();
const inMemoryAuditChain = [];

/**
 * POST /api/audit-stream/log
 * Logs a new cryptographically signed audit event
 */
router.post('/log', (req, res) => {
  const { action, userId, details } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'Action field is required' });
  }

  const signedEvent = verifier.signEvent({ action, userId, details });
  inMemoryAuditChain.push(signedEvent);

  return res.status(201).json({
    success: true,
    message: 'Audit log entry recorded with cryptographic signature',
    event: signedEvent
  });
});

/**
 * GET /api/audit-stream/verify
 * Verifies the tamper-evident chain integrity of logged events
 */
router.get('/verify', (req, res) => {
  const verificationResult = verifier.verifyChain(inMemoryAuditChain);
  return res.json({
    totalEvents: inMemoryAuditChain.length,
    verification: verificationResult
  });
});

module.exports = router;
