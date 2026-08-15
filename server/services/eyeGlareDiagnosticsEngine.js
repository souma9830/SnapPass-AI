/**
 * Server-side eye glare diagnostic evaluator
 */

export function auditEyeGlareRatio(ratio) {
  if (ratio > 5.0) {
    return { status: 'FAIL', reason: 'High specular glare over pupil zone' };
  } else if (ratio > 3.0) {
    return { status: 'WARNING', reason: 'Mild lens reflection detected' };
  }
  return { status: 'PASS', reason: 'Eye region clear of specular reflection' };
}
