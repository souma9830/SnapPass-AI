import { logSecurityEvent } from '../auditLogger.service.js';
import SecurityAudit from '../../models/securityAudit.model.js';

describe('AuditLogger Service', () => {
  test('logs security event to database schema format', async () => {
    const createSpy = jest.spyOn(SecurityAudit, 'create').mockResolvedValue({});
    await logSecurityEvent({
      action: 'LOGIN_FAILURE',
      email: 'test@example.com',
      status: 'FAILURE',
      severity: 'WARNING'
    });
    expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'LOGIN_FAILURE',
      email: 'test@example.com',
      status: 'FAILURE',
      severity: 'WARNING'
    }));
    createSpy.mockRestore();
  });
});
