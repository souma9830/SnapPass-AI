# ICAO 9303 Compliance Audit PDF Report Generator

The **ICAO Compliance Audit PDF Report Generator** generates official PDF certificates verifying that passport photos meet all biometric and image standard specifications of ICAO 9303.

## Workflow Integration

1. Backend payload construction via `buildIcaoAuditReportPayload()`.
2. Execution verification with `node server/tests/verifyPdfComplianceReport.js`.
3. Client export component `<PdfComplianceExportButton />`.
