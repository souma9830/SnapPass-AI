import { getMetrics, resetMetrics } from '../middleware/timing.middleware.js';

export function getServerMetrics(req, res) {
  res.json({ success: true, data: getMetrics() });
}

export function resetServerMetrics(req, res) {
  resetMetrics();
  res.json({ success: true, message: 'Metrics reset.' });
}
