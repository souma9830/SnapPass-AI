import mongoose from 'mongoose';

const circuitBreakerMetricSchema = new mongoose.Schema(
  {
    service: { type: String, required: true, default: 'python-ai-service' },
    state: {
      type: String,
      enum: ['CLOSED', 'HALF-OPEN', 'OPEN'],
      required: true,
    },
    event: {
      type: String,
      enum: ['success', 'failure', 'open', 'half-open', 'status'],
      required: true,
    },
    failureCount: { type: Number, default: 0 },
    failureThreshold: { type: Number, default: 5 },
    resetTimeoutMs: { type: Number, default: 30000 },
    nextAttempt: { type: Date, default: null },
    errorMessage: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

circuitBreakerMetricSchema.index({ service: 1, createdAt: -1 });

const CircuitBreakerMetric = mongoose.model(
  'CircuitBreakerMetric',
  circuitBreakerMetricSchema
);

export default CircuitBreakerMetric;