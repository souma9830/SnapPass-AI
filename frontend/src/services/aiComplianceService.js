/**
 * aiComplianceService.js
 * Utility routines for calculating real-time passport photo compliance scores
 * and detailed metrics breakdowns based on official ICAO doc 9303 standards.
 */

export function calculateComplianceMetrics(photoData = {}) {
  const {
    headRatio = 0.72,
    backgroundUniformity = 94,
    lightingScore = 88,
    eyeAlignment = 98,
    resolutionDpi = 300,
    faceCentered = true,
  } = photoData;

  const checks = [
    {
      id: 'head_size',
      title: 'Head Height & Framing',
      score: Math.round(headRatio * 100),
      passed: headRatio >= 0.68 && headRatio <= 0.80,
      weight: 25,
      recommendation: headRatio < 0.68 ? 'Zoom in to increase head height to 70-80% of frame.' : headRatio > 0.80 ? 'Zoom out to leave sufficient margin around head.' : 'Framing complies with ICAO specifications.',
    },
    {
      id: 'bg_uniformity',
      title: 'Background Uniformity',
      score: backgroundUniformity,
      passed: backgroundUniformity >= 85,
      weight: 20,
      recommendation: backgroundUniformity >= 85 ? 'Background lighting and tone are uniform.' : 'Use background removal tool to eliminate shadows.',
    },
    {
      id: 'lighting_quality',
      title: 'Lighting & Shadow Balance',
      score: lightingScore,
      passed: lightingScore >= 80,
      weight: 20,
      recommendation: lightingScore >= 80 ? 'Facial lighting is evenly distributed.' : 'Adjust brightness to eliminate heavy facial shadows.',
    },
    {
      id: 'eye_alignment',
      title: 'Eye Alignment & Gaze',
      score: eyeAlignment,
      passed: eyeAlignment >= 90,
      weight: 20,
      recommendation: eyeAlignment >= 90 ? 'Eyes are horizontal and centered.' : 'Straighten head alignment so eyes sit on a level line.',
    },
    {
      id: 'resolution_dpi',
      title: 'Print Resolution (DPI)',
      score: resolutionDpi >= 300 ? 100 : Math.round((resolutionDpi / 300) * 100),
      passed: resolutionDpi >= 300,
      weight: 15,
      recommendation: resolutionDpi >= 300 ? 'Resolution satisfies 300 DPI print standard.' : 'Upload higher resolution source image for crisp printing.',
    },
  ];

  const totalScore = Math.round(
    checks.reduce((acc, curr) => acc + (curr.score * curr.weight) / 100, 0)
  );

  let status = 'NON_COMPLIANT';
  let grade = 'F';
  if (totalScore >= 90) {
    status = 'EXCELLENT';
    grade = 'A+';
  } else if (totalScore >= 80) {
    status = 'COMPLIANT';
    grade = 'A';
  } else if (totalScore >= 68) {
    status = 'NEEDS_REVISION';
    grade = 'B';
  }

  return {
    totalScore,
    grade,
    status,
    passed: totalScore >= 80 && faceCentered,
    checks,
  };
}


export default {
  calculateComplianceMetrics,
};
