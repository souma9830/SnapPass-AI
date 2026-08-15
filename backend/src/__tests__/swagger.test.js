/**
 * swagger.test.js — Swagger Spec Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { generateOpenApiSpec } from '../config/swaggerSpecGenerator.js';

describe('SwaggerSpecGenerator Tests', () => {
  it('should generate valid openapi specification', () => {
    const spec = generateOpenApiSpec();
    expect(spec.openapi).toBe('3.0.0');
  });
});
