import { computePassportComplianceScore } from '../complianceRulesEngine.js';

describe('Compliance Rules Engine Utility', () => {
  test('calculates 100 score for fully compliant photo', () => {
    const report = computePassportComplianceScore({
      face_detected: true,
      multiple_faces: false,
      background_valid: true,
      lighting_uniform: true,
      sharpness_ok: true,
      eyes_visible: true
    });
    expect(report.score).toBe(100);
    expect(report.status).toBe('PASS');
    expect(report.deductions.length).toBe(0);
  });

  test('deducts points and sets FAIL for missing face', () => {
    const report = computePassportComplianceScore({
      face_detected: false,
      background_valid: false
    });
    expect(report.score).toBe(30);
    expect(report.status).toBe('FAIL');
    expect(report.deductions.length).toBe(2);
  });
});
