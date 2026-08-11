import express from 'express';
import circuitBreakerTelemetryService from '../services/circuitBreakerTelemetry.service.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const aggregate = await circuitBreakerTelemetryService.getAggregate(
      req.query.service
    );
    res.json({ success: true, data: aggregate });
  } catch (error) {
    next(error);
  }
});

router.get('/events', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 1000);
    const events = await circuitBreakerTelemetryService.getRecentMetrics(
      req.query.service,
      limit
    );
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
});

export default router;