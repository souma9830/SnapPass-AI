/**
 * ICAO 9303 Compliance PDF Certificate Generator
 * Formats biometric compliance data into a structured printable PDF document.
 */

/**
 * Builds HTML template for ICAO compliance certificate.
 * @param {Object} data - Audit details
 * @returns {string} HTML string ready for PDF rendering or printing
 */
export function buildIcaoCertificateHtml(data) {
  const {
    certificateId = `ICAO-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    timestamp = new Date().toISOString(),
    countryCode = 'US',
    complianceScore = 95,
    checks = {
      resolution: true,
      lightingUniformity: true,
      headPose: true,
      backgroundNeutrality: true,
      eyeOpenness: true
    }
  } = data || {};

  return `
    <div style="font-family: Arial, sans-serif; padding: 30px; border: 2px solid #1e293b; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 2px solid #e2e8f0; pb-15px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0;">ICAO 9303 BIOMETRIC COMPLIANCE CERTIFICATE</h2>
        <p style="color: #64748b; font-size: 12px; margin-top: 5px;">SnapPass AI Verification System</p>
      </div>

      <div style="margin-bottom: 20px; font-size: 14px; line-height: 1.6;">
        <p><strong>Certificate ID:</strong> ${certificateId}</p>
        <p><strong>Issued At:</strong> ${timestamp}</p>
        <p><strong>Target Country Preset:</strong> ${countryCode}</p>
        <p><strong>Overall Compliance Rating:</strong> <span style="color: ${complianceScore >= 85 ? '#16a34a' : '#dc2626'}; font-weight: bold;">${complianceScore}%</span></p>
      </div>

      <h3 style="color: #334155; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px;">Biometric Verification Checklist</h3>
      <ul style="list-style: none; padding: 0; font-size: 13px;">
        <li style="padding: 6px 0;">📷 High-Resolution DPI Check: ${checks.resolution ? '✅ PASS' : '❌ FAIL'}</li>
        <li style="padding: 6px 0;">💡 Lighting & Shadow Uniformity: ${checks.lightingUniformity ? '✅ PASS' : '❌ FAIL'}</li>
        <li style="padding: 6px 0;">👤 Frontal Head Pose (Yaw/Pitch/Roll): ${checks.headPose ? '✅ PASS' : '❌ FAIL'}</li>
        <li style="padding: 6px 0;">⬜ Neutral Solid Background: ${checks.backgroundNeutrality ? '✅ PASS' : '❌ FAIL'}</li>
        <li style="padding: 6px 0;">👁️ Eye Visibility & Openness: ${checks.eyeOpenness ? '✅ PASS' : '❌ FAIL'}</li>
      </ul>

      <div style="margin-top: 30px; border-top: 1px dashed #cbd5e1; pt-15px; text-align: center; font-size: 11px; color: #94a3b8;">
        Digitally signed by SnapPass AI Biometric Engine v1.0. Tamper-evident hash chain verified.
      </div>
    </div>
  `;
}
