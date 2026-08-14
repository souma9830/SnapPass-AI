import { evaluateTenantQuotaAlert } from '../services/rateLimitAlertDispatcher.js';

console.log('Verifying Rate Limit Alert Dispatcher logic...');

const warningAlert = evaluateTenantQuotaAlert('tenant_123', 85, 100);
if (!warningAlert || warningAlert.severity !== 'WARNING') {
  console.error('Failed: Expected WARNING alert for 85% usage');
  process.exit(1);
}

const criticalAlert = evaluateTenantQuotaAlert('tenant_123', 97, 100);
if (!criticalAlert || criticalAlert.severity !== 'CRITICAL') {
  console.error('Failed: Expected CRITICAL alert for 97% usage');
  process.exit(1);
}

const normalAlert = evaluateTenantQuotaAlert('tenant_123', 50, 100);
if (normalAlert !== null) {
  console.error('Failed: Expected null alert for normal 50% usage');
  process.exit(1);
}

console.log('Rate Limit Alert Dispatcher tests passed successfully!');
