const mongoose = require('mongoose');

const circuitBreakerMetricSchema = new mongoose.Schema({
  serviceName: { type: String, required: true, index: true },
  state: { type: String, enum: ['CLOSED', 'OPEN', 'HALF_OPEN'], default: 'CLOSED' },
  totalRequests: { type: Number, default: 0 },
  failedRequests: { type: Number, default: 0 },
  avgLatencyMs: { type: Number, default: 0 },
  tenantId: { type: String, default: 'global' }
}, { timestamps: true });

module.exports = mongoose.model('CircuitBreakerMetric', circuitBreakerMetricSchema);
