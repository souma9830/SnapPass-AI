/**
 * Server-side photo quality telemetry metric streamer
 */

export function streamQualityTelemetry(photoId, score) {
  return {
    photoId,
    score,
    loggedAt: new Date().toISOString(),
    status: score >= 80 ? 'HIGH_QUALITY' : 'NEEDS_REFINEMENT'
  };
}
