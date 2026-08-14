/**
 * Server-side shadow removal diagnostics telemetry service
 */

export function evaluateShadowRemovalTelemetry(initialAvgLum, processedAvgLum) {
  const lumDelta = processedAvgLum - initialAvgLum;
  const percentageImprovement = initialAvgLum > 0 ? (lumDelta / initialAvgLum) * 100 : 0;

  return {
    initialAvgLum,
    processedAvgLum,
    lumDelta: Math.round(lumDelta),
    percentageImprovement: parseFloat(percentageImprovement.toFixed(2)),
    isOptimized: percentageImprovement >= 10
  };
}
