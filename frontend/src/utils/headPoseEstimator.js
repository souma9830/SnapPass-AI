/**
 * Head Pose Estimator (Yaw, Pitch, Roll) for ICAO 9303 Compliance
 * Calculates 3D head orientation angles from 2D facial landmark points.
 */

/**
 * Estimates pitch, yaw, and roll angles in degrees from standard 68-point facial landmarks.
 * @param {Array<{x: number, y: number}>} landmarks - Array of facial landmark coordinates.
 * @returns {{yaw: number, pitch: number, roll: number, isCompliant: boolean, warnings: Array<string>}}
 */
export function calculateHeadPose(landmarks) {
  if (!landmarks || !Array.isArray(landmarks) || landmarks.length < 68) {
    return {
      yaw: 0,
      pitch: 0,
      roll: 0,
      isCompliant: false,
      warnings: ['Insufficient landmark points for head pose calculation (requires 68 points)']
    };
  }

  // Key landmark indices (0-indexed standard Dlib / MediaPipe 68 model)
  // Left eye center ~ 36-41, Right eye center ~ 42-47
  const noseTip = landmarks[30];
  const noseBase = landmarks[33];
  const chin = landmarks[8];
  const leftEyeOuter = landmarks[36];
  const rightEyeOuter = landmarks[45];
  const leftMouthCorner = landmarks[48];
  const rightMouthCorner = landmarks[54];

  // 1. Calculate Roll (In-plane rotation)
  // Angle of vector connecting outer eye corners relative to horizontal axis
  const deltaX = rightEyeOuter.x - leftEyeOuter.x;
  const deltaY = rightEyeOuter.y - leftEyeOuter.y;
  const rollRad = Math.atan2(deltaY, deltaX);
  const rollDeg = Math.round((rollRad * (180 / Math.PI)) * 10) / 10;

  // 2. Calculate Yaw (Left / Right rotation)
  // Ratio of distance from nose tip to left eye vs right eye outer corners
  const distNoseToLeftEye = Math.hypot(noseTip.x - leftEyeOuter.x, noseTip.y - leftEyeOuter.y);
  const distNoseToRightEye = Math.hypot(noseTip.x - rightEyeOuter.x, noseTip.y - rightEyeOuter.y);
  const totalEyeWidth = distNoseToLeftEye + distNoseToRightEye;
  
  let yawDeg = 0;
  if (totalEyeWidth > 0) {
    const symmetryRatio = (distNoseToRightEye - distNoseToLeftEye) / totalEyeWidth;
    // Non-linear mapping to degrees (-45 deg to +45 deg approx)
    yawDeg = Math.round((symmetryRatio * 60) * 10) / 10;
  }

  // 3. Calculate Pitch (Up / Down tilt)
  // Vertical position of nose relative to eye-midpoint and chin axis
  const eyeMidpointY = (leftEyeOuter.y + rightEyeOuter.y) / 2;
  const noseToEyeDist = noseTip.y - eyeMidpointY;
  const noseToChinDist = chin.y - noseTip.y;
  
  let pitchDeg = 0;
  if (noseToChinDist > 0) {
    const verticalRatio = noseToEyeDist / noseToChinDist;
    // Standard frontal ratio is ~0.65. Deviation indicates upward/downward tilt
    const pitchOffset = verticalRatio - 0.65;
    pitchDeg = Math.round((pitchOffset * 50) * 10) / 10;
  }

  // ICAO 9303 Compliance thresholds: Yaw <= +-5 deg, Pitch <= +-5 deg, Roll <= +-3 deg
  const warnings = [];
  if (Math.abs(yawDeg) > 5) {
    warnings.push(`Head is turned ${yawDeg > 0 ? 'right' : 'left'} by ${Math.abs(yawDeg)}° (max allowed: 5°)`);
  }
  if (Math.abs(pitchDeg) > 5) {
    warnings.push(`Head is tilted ${pitchDeg > 0 ? 'downward' : 'upward'} by ${Math.abs(pitchDeg)}° (max allowed: 5°)`);
  }
  if (Math.abs(rollDeg) > 3) {
    warnings.push(`Head is tilted sideways by ${Math.abs(rollDeg)}° (max allowed: 3°)`);
  }

  return {
    yaw: yawDeg,
    pitch: pitchDeg,
    roll: rollDeg,
    isCompliant: warnings.length === 0,
    warnings
  };
}
