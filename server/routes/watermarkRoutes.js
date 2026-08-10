const express = require('express');
const router = express.Router();
const watermarkEngine = require('../services/watermarkSecurityEngine');

router.post('/generate', (req, res) => {
  const { photoId, tenantId } = req.body;
  if (!photoId || !tenantId) {
    return res.status(400).json({ error: 'photoId and tenantId are required' });
  }

  const token = watermarkEngine.generateWatermarkToken(photoId, tenantId);
  return res.json({ success: true, watermark: token });
});

router.post('/verify', (req, res) => {
  const { photoId, tenantId, timestamp, signature } = req.body;
  if (!photoId || !tenantId || !timestamp || !signature) {
    return res.status(400).json({ error: 'Missing watermark validation parameters' });
  }

  try {
    const result = watermarkEngine.verifyWatermarkToken(photoId, tenantId, timestamp, signature);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: 'Verification failed: invalid token signature format' });
  }
});

module.exports = router;
