import { getMetrics, resetMetrics } from '../middleware/timing.middleware.js';
import { TelemetryAggregatorService } from '../services/telemetryAggregator.service.js';
import { formatTelemetryPayload } from '../utils/telemetryFormatter.utils.js';

export function getServerMetrics(req, res) {
  const telemetry = formatTelemetryPayload(TelemetryAggregatorService.getSummary());
  res.json({ success: true, data: { ...getMetrics(), telemetry } });
}

export function resetServerMetrics(req, res) {
  resetMetrics();
  TelemetryAggregatorService.reset();
  res.json({ success: true, message: 'Metrics reset.' });
}

