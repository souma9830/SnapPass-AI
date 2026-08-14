/**
 * Dispatcher service for broadcasting multi-tenant rate-limiting breach notifications
 */

const alertThresholds = {
  WARNING: 0.8, // 80% quota consumed
  CRITICAL: 0.95 // 95% quota consumed
};

export function evaluateTenantQuotaAlert(tenantId, currentRequests, maxQuota) {
  if (!maxQuota || maxQuota <= 0) return null;

  const usageRatio = currentRequests / maxQuota;

  if (usageRatio >= alertThresholds.CRITICAL) {
    return {
      tenantId,
      severity: 'CRITICAL',
      usageRatio: parseFloat((usageRatio * 100).toFixed(1)),
      message: `Tenant ${tenantId} has consumed ${Math.round(usageRatio * 100)}% of API rate limit quota (${currentRequests}/${maxQuota}).`,
      timestamp: new Date().toISOString()
    };
  } else if (usageRatio >= alertThresholds.WARNING) {
    return {
      tenantId,
      severity: 'WARNING',
      usageRatio: parseFloat((usageRatio * 100).toFixed(1)),
      message: `Tenant ${tenantId} warning: ${Math.round(usageRatio * 100)}% of API rate limit quota used.`,
      timestamp: new Date().toISOString()
    };
  }

  return null;
}
