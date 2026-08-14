/**
 * Generates structured ICAO 9303 compliance audit reports for PDF export stream
 */

export function buildIcaoAuditReportPayload(photoMetadata, complianceResult) {
  const generatedAt = new Date().toISOString();
  
  return {
    reportId: `ICAO-AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    generatedAt,
    overallScore: complianceResult.overallScore || 0,
    status: complianceResult.overallScore >= 85 ? 'PASSED' : 'ACTION_REQUIRED',
    photoDetails: {
      dimensionsPx: photoMetadata.dimensionsPx || '600x600',
      dpi: photoMetadata.dpi || 300,
      aspectRatio: photoMetadata.aspectRatio || '1:1',
      fileSizeBytes: photoMetadata.fileSizeBytes || 0
    },
    complianceChecks: [
      { name: 'Head Centering', score: complianceResult.headCenteringScore || 100, pass: (complianceResult.headCenteringScore || 100) >= 80 },
      { name: 'Eye Alignment', score: complianceResult.eyeAlignmentScore || 100, pass: (complianceResult.eyeAlignmentScore || 100) >= 80 },
      { name: 'Background Uniformity', score: complianceResult.bgUniformityScore || 100, pass: (complianceResult.bgUniformityScore || 100) >= 80 },
      { name: 'Lighting & Shadow Balance', score: complianceResult.lightingScore || 100, pass: (complianceResult.lightingScore || 100) >= 80 }
    ],
    warnings: complianceResult.warnings || []
  };
}

export function formatIcaoReportSummaryText(payload) {
  return `=== SNAPPASS AI - ICAO 9303 COMPLIANCE AUDIT CERTIFICATE ===\nReport ID: ${payload.reportId}\nTimestamp: ${payload.generatedAt}\nOverall Status: ${payload.status} (${payload.overallScore}/100)\nDimensions: ${payload.photoDetails.dimensionsPx} | DPI: ${payload.photoDetails.dpi}\n=============================================================`;
}
