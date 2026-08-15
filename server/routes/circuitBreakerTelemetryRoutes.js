const express = require('express');
const router = express.Router();
const telemetryService = require('../services/circuitBreakerTelemetryService');

router.get('/metrics', (req, res) => {
  const { service } = req.query;
  const metrics = telemetryService.getMetrics(service);
  return res.json({ success: true, telemetry: metrics });
});

router.post('/state', (req, res) => {
  const { serviceName, state, latencyMs, error } = req.body;
  if (!serviceName || !state) {
    return res.status(400).json({ error: 'serviceName and state are required' });
  }

  const updated = telemetryService.registerStateChange(serviceName, state, latencyMs || 0, error);
  return res.json({ success: true, service: serviceName, current: updated });
});

module.exports = router;
