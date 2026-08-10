const telemetryService = require('../services/circuitBreakerTelemetryService');

console.log('Testing Circuit Breaker Telemetry Service...');

telemetryService.registerStateChange('python-ai-service', 'CLOSED', 45);
telemetryService.registerStateChange('python-ai-service', 'OPEN', 500, 'TimeoutError');

const metrics = telemetryService.getMetrics('python-ai-service');
console.log('Recorded Metrics:', metrics);

if (metrics && metrics.state === 'OPEN' && metrics.failedRequests === 1) {
  console.log('SUCCESS: Circuit breaker state change recorded properly!');
} else {
  console.error('FAILED: Incorrect telemetry state recording');
  process.exit(1);
}
