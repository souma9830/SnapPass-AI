import { buildIcaoAuditReportPayload, formatIcaoReportSummaryText } from '../services/pdfComplianceReportGenerator.js';

console.log('Testing ICAO PDF Compliance Report Generator...');

const mockMetadata = {
  dimensionsPx: '600x600',
  dpi: 300,
  aspectRatio: '1:1',
  fileSizeBytes: 245000
};

const mockCompliance = {
  overallScore: 92,
  headCenteringScore: 95,
  eyeAlignmentScore: 90,
  bgUniformityScore: 94,
  lightingScore: 89,
  warnings: []
};

const payload = buildIcaoAuditReportPayload(mockMetadata, mockCompliance);
if (payload.status !== 'PASSED') {
  console.error('Test Failed: Expected status PASSED');
  process.exit(1);
}

const summaryText = formatIcaoReportSummaryText(payload);
if (!summaryText.includes('PASSED (92/100)')) {
  console.error('Test Failed: Summary text formatting error');
  process.exit(1);
}

console.log('PDF Compliance Report Generator tests passed successfully!');
