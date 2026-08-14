export interface Landmark3D {
  x: number;
  y: number;
  z: number;
}

export interface BiometricMeshLandmarks {
  leftEye: Landmark3D[];
  rightEye: Landmark3D[];
  noseBridge: Landmark3D[];
  mouthOutline: Landmark3D[];
  jawline: Landmark3D[];
  chinPoint: Landmark3D;
  foreheadTop: Landmark3D;
}

export interface BiometricMeshEvaluationResult {
  isMeshCompliant: boolean;
  confidenceScore: number;
  interpupillaryDistancePx: number;
  eyeSymmetryIndex: number;
  yawAngleDegrees: number;
  pitchAngleDegrees: number;
  rollAngleDegrees: number;
  warnings: string[];
}
