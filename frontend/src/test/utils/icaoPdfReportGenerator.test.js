import { describe, it, expect } from 'vitest';
import { buildIcaoCertificateHtml } from '../../utils/icaoPdfReportGenerator';

describe('icaoPdfReportGenerator', () => {
  it('generates valid HTML string with default certificate values', () => {
    const html = buildIcaoCertificateHtml({});
    expect(html).toContain('ICAO 9303 BIOMETRIC COMPLIANCE CERTIFICATE');
    expect(html).toContain('SnapPass AI Verification System');
    expect(html).toContain('95%');
  });

  it('reflects custom compliance score and country preset', () => {
    const html = buildIcaoCertificateHtml({
      countryCode: 'UK',
      complianceScore: 78
    });
    expect(html).toContain('UK');
    expect(html).toContain('78%');
  });
});
