export function computePassportComplianceScore(checklist = {}) {
  let score = 100;
  const deductions = [];

  if (checklist.face_detected === false) {
    score -= 50;
    deductions.push('No face detected in photo (-50)');
  }
  if (checklist.multiple_faces === true) {
    score -= 40;
    deductions.push('Multiple faces detected (-40)');
  }
  if (checklist.background_valid === false) {
    score -= 20;
    deductions.push('Non-plain/invalid background color (-20)');
  }
  if (checklist.lighting_uniform === false) {
    score -= 15;
    deductions.push('Uneven lighting or shadow detected (-15)');
  }
  if (checklist.sharpness_ok === false) {
    score -= 15;
    deductions.push('Image is blurry or low sharpness (-15)');
  }
  if (checklist.eyes_visible === false) {
    score -= 30;
    deductions.push('Eyes closed or obscured (-30)');
  }

  const finalScore = Math.max(0, score);
  let status = 'PASS';
  if (finalScore < 60) {
    status = 'FAIL';
  } else if (finalScore < 85) {
    status = 'WARN';
  }

  return {
    score: finalScore,
    status,
    deductions
  };
}
