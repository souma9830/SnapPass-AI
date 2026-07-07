const metrics = {
  totalRequests: 0,
  activeRequests: 0,
  methodCounts: {},
  routeCounts: {},
  statusCounts: {},
  responseTimes: [],
  startTime: Date.now(),
};

export function timingMiddleware(req, res, next) {
  metrics.totalRequests++;
  metrics.activeRequests++;
  metrics.methodCounts[req.method] = (metrics.methodCounts[req.method] || 0) + 1;

  const route = req.route ? req.route.path : req.path;
  metrics.routeCounts[route] = (metrics.routeCounts[route] || 0) + 1;

  const start = Date.now();

  res.on('finish', () => {
    metrics.activeRequests--;
    const duration = Date.now() - start;
    metrics.statusCounts[res.statusCode] = (metrics.statusCounts[res.statusCode] || 0) + 1;

    metrics.responseTimes.push(duration);
    if (metrics.responseTimes.length > 1000) {
      metrics.responseTimes.shift();
    }
  });

  next();
}

export function getMetrics() {
  const times = metrics.responseTimes;
  const avg = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  const sorted = [...times].sort((a, b) => a - b);
  const p50 = sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.5)] : 0;
  const p95 = sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.95)] : 0;
  const p99 = sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.99)] : 0;

  return {
    uptime: Date.now() - metrics.startTime,
    totalRequests: metrics.totalRequests,
    activeRequests: metrics.activeRequests,
    methodCounts: metrics.methodCounts,
    routeCounts: metrics.routeCounts,
    statusCounts: metrics.statusCounts,
    latency: { avg, p50, p95, p99, samples: times.length },
  };
}

export function resetMetrics() {
  metrics.totalRequests = 0;
  metrics.activeRequests = 0;
  metrics.methodCounts = {};
  metrics.routeCounts = {};
  metrics.statusCounts = {};
  metrics.responseTimes = [];
}
