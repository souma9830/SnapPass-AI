import SecurityAudit from '../models/securityAudit.model.js';

export const logSecurityEvent = async ({
  action,
  userId = null,
  email,
  ip = '',
  status = 'SUCCESS',
  severity = 'INFO',
  userAgent = '',
  details = ''
}) => {
  try {
    await SecurityAudit.create({
      action,
      userId,
      email: email ? email.toLowerCase().trim() : 'anonymous',
      ip,
      status,
      severity,
      userAgent: (userAgent || '').slice(0, 255),
      details: typeof details === 'object' ? JSON.stringify(details) : String(details)
    });
  } catch (err) {
    console.error('[SecurityAudit] Failed to log security event:', err.message);
  }
};
