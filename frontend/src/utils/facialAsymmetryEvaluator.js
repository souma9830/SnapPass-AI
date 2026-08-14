/**
 * Biometric Facial Asymmetry & Proportional Geometry Analyzer
 * Evaluates ICAO 9303 facial symmetry, eye alignment, and mouth centering.
 */

/**
 * Calculates facial symmetry and geometric proportions from facial landmarks.
 * @param {Array<{x: number, y: number}>} landmarks - Array of 68 facial landmark coordinates.
 * @returns {{symmetryScore: number, eyeLevelDiffPx: number, mouthCenteringOffsetPx: number, isCompliant: boolean, details: Object}}
 */
export function calculateFacialAsymmetry(landmarks) {
  if (!landmarks || !Array.isArray(landmarks) || landmarks.length < 68) {
    return {
      symmetryScore: 0,
      eyeLevelDiffPx: 0,
      mouthCenteringOffsetPx: 0,
      isCompliant: false,
      details: { error: 'Insufficient facial landmarks provided' }
    };
  }

  const leftEyeCenter = {
    x: (landmarks[36].x + landmarks[39].x) / 2,
    y: (landmarks[36].y + landmarks[39].y) / 2
  };

  const rightEyeCenter = {
    x: (landmarks[42].x + landmarks[45].x) / 2,
    y: (landmarks[42].y + landmarks[45].y) / 2
  };

  const noseCenter = landmarks[30];
  const mouthCenter = {
    x: (landmarks[48].x + landmarks[54].x) / 2,
    y: (landmarks[48].y + landmarks[54].y) / 2
  };

  // 1. Eye Level Tilt Difference (in Y-axis pixels)
  const eyeLevelDiffPx = Math.round(Math.abs(leftEyeCenter.y - rightEyeCenter.y) * 10) / 10;

  // 2. Midline Alignment (Nose & Mouth relative to Eye Midpoint)
  const eyeMidpointX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
  const mouthCenteringOffsetPx = Math.round(Math.abs(mouthCenter.x - eyeMidpointX) * 10) / 10;
  const noseCenteringOffsetPx = Math.round(Math.abs(noseCenter.x - eyeMidpointX) * 10) / 10;

  // 3. Overall Symmetry Score (0 - 100)
  const maxAllowedOffset = 15; // px threshold for 100% loss
  const totalOffset = eyeLevelDiffPx + mouthCenteringOffsetPx + noseCenteringOffsetPx;
  const symmetryScore = Math.max(0, Math.round(100 - (totalOffset / maxAllowedOffset) * 100));

  const isCompliant = symmetryScore >= 80 && eyeLevelDiffPx <= 4;

  return {
    symmetryScore,
    eyeLevelDiffPx,
    mouthCenteringOffsetPx,
    isCompliant,
    details: {
      leftEyeY: leftEyeCenter.y,
      rightEyeY: rightEyeCenter.y,
      noseOffset: noseCenteringOffsetPx
    }
  };
}
