/**
 * Utility to calculate real-time passport photo compliance metrics and score breakdown
 */
export function calculateComplianceScore(metrics = {}) {
  const {
    faceDetected = true,
    lightingScore = 85,
    backgroundUniformity = 90,
    headPoseCentered = true,
    dimensionsValid = true,
    sharpnessScore = 80,
  } = metrics;

  let totalPoints = 0;
  let maxPoints = 100;
  const breakdown = [];

  // Face Detection (30 pts)
  if (faceDetected) {
    totalPoints += 30;
    breakdown.push({ rule: 'Face Detection', status: 'pass', weight: 30, text: 'Single face clearly detected' });
  } else {
    breakdown.push({ rule: 'Face Detection', status: 'fail', weight: 30, text: 'No face detected in photo' });
  }

  // Head Centering (20 pts)
  if (headPoseCentered) {
    totalPoints += 20;
    breakdown.push({ rule: 'Head Alignment', status: 'pass', weight: 20, text: 'Head is properly centered' });
  } else {
    breakdown.push({ rule: 'Head Alignment', status: 'fail', weight: 20, text: 'Head is tilted or off-center' });
  }

  // Background Uniformity (20 pts)
  const bgPts = Math.round((Math.min(100, Math.max(0, backgroundUniformity)) / 100) * 20);
  totalPoints += bgPts;
  breakdown.push({
    rule: 'Background Uniformity',
    status: bgPts >= 15 ? 'pass' : 'warning',
    weight: 20,
    text: `Background contrast score: ${backgroundUniformity}%`,
  });

  // Lighting Balance (15 pts)
  const lightPts = Math.round((Math.min(100, Math.max(0, lightingScore)) / 100) * 15);
  totalPoints += lightPts;
  breakdown.push({
    rule: 'Lighting Quality',
    status: lightPts >= 10 ? 'pass' : 'warning',
    weight: 15,
    text: `Lighting balance score: ${lightingScore}%`,
  });

  // Dimensions & Aspect Ratio (15 pts)
  if (dimensionsValid) {
    totalPoints += 15;
    breakdown.push({ rule: 'Dimensions & Resolution', status: 'pass', weight: 15, text: 'Valid dimensions' });
  } else {
    breakdown.push({ rule: 'Dimensions & Resolution', status: 'fail', weight: 15, text: 'Invalid photo aspect ratio' });
  }

  const score = Math.min(100, Math.max(0, totalPoints));

  let grade = 'A';
  let statusClass = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400';
  if (score < 60) {
    grade = 'F';
    statusClass = 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400';
  } else if (score < 80) {
    grade = 'B';
    statusClass = 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400';
  }

  return {
    score,
    grade,
    statusClass,
    breakdown,
    isCompliant: score >= 75,
  };
}
