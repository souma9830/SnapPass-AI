import { BiometricMeshLandmarks, BiometricMeshEvaluationResult, Landmark3D } from '../types/biometricMesh';

/**
 * Calculates Euclidean distance between two 3D landmarks
 */
export function calculateLandmarkDistance(p1: Landmark3D, p2: Landmark3D): number {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2)
  );
}

/**
 * Evaluates facial mesh landmarks for ICAO biometric compliance
 */
export function evaluateBiometricMesh(landmarks: BiometricMeshLandmarks): BiometricMeshEvaluationResult {
  const warnings: string[] = [];

  if (!landmarks || !landmarks.leftEye || !landmarks.rightEye || landmarks.leftEye.length === 0 || landmarks.rightEye.length === 0) {
    return {
      isMeshCompliant: false,
      confidenceScore: 0,
      interpupillaryDistancePx: 0,
      eyeSymmetryIndex: 0,
      yawAngleDegrees: 0,
      pitchAngleDegrees: 0,
      rollAngleDegrees: 0,
      warnings: ['Incomplete facial landmark data provided']
    };
  }

  const leftEyeCenter: Landmark3D = {
    x: landmarks.leftEye.reduce((sum, p) => sum + p.x, 0) / landmarks.leftEye.length,
    y: landmarks.leftEye.reduce((sum, p) => sum + p.y, 0) / landmarks.leftEye.length,
    z: landmarks.leftEye.reduce((sum, p) => sum + p.z, 0) / landmarks.leftEye.length,
  };

  const rightEyeCenter: Landmark3D = {
    x: landmarks.rightEye.reduce((sum, p) => sum + p.x, 0) / landmarks.rightEye.length,
    y: landmarks.rightEye.reduce((sum, p) => sum + p.y, 0) / landmarks.rightEye.length,
    z: landmarks.rightEye.reduce((sum, p) => sum + p.z, 0) / landmarks.rightEye.length,
  };

  const interpupillaryDistancePx = calculateLandmarkDistance(leftEyeCenter, rightEyeCenter);

  if (interpupillaryDistancePx < 60) {
    warnings.push('Interpupillary distance is below the minimum required 60px resolution');
  }

  const dy = rightEyeCenter.y - leftEyeCenter.y;
  const dx = rightEyeCenter.x - leftEyeCenter.x;
  const rollAngleDegrees = Math.atan2(dy, dx) * (180 / Math.PI);

  if (Math.abs(rollAngleDegrees) > 3.0) {
    warnings.push(`Head roll angle (${rollAngleDegrees.toFixed(1)}°) exceeds 3.0° ICAO limit`);
  }

  const noseTip = landmarks.noseBridge[landmarks.noseBridge.length - 1] || { x: 0, y: 0, z: 0 };
  const eyeMidpointX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
  const yawAngleDegrees = (noseTip.x - eyeMidpointX) * 0.5;

  if (Math.abs(yawAngleDegrees) > 5.0) {
    warnings.push(`Head yaw angle (${yawAngleDegrees.toFixed(1)}°) exceeds 5.0° ICAO limit`);
  }

  const eyeMidpointY = (leftEyeCenter.y + rightEyeCenter.y) / 2;
  const pitchAngleDegrees = (noseTip.y - eyeMidpointY) * 0.3;

  const eyeSymmetryIndex = Math.max(0, 100 - Math.abs(dy) * 5);
  const confidenceScore = Math.max(0, 100 - warnings.length * 25);

  return {
    isMeshCompliant: warnings.length === 0,
    confidenceScore,
    interpupillaryDistancePx: Math.round(interpupillaryDistancePx),
    eyeSymmetryIndex: Math.round(eyeSymmetryIndex),
    yawAngleDegrees: parseFloat(yawAngleDegrees.toFixed(2)),
    pitchAngleDegrees: parseFloat(pitchAngleDegrees.toFixed(2)),
    rollAngleDegrees: parseFloat(rollAngleDegrees.toFixed(2)),
    warnings
  };
}
