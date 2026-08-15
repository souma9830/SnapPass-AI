/**
 * anomalyDetector.service.js — Backend Biometric Anomaly Evaluator Service
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export class AnomalyDetectorService {
  static evaluate(faceCount, occlusionScore) {
    const isMultiFace = faceCount > 1;
    return {
      isCompliant: faceCount === 1 && occlusionScore <= 0.4,
      isMultiFace,
      error: isMultiFace ? 'MULTI_FACE_REJECTED' : null,
    };
  }
}
