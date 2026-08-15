# Multi-Tenant Rate Limiting Alert Dispatcher

The **Multi-Tenant Rate Limiting Alert Dispatcher** evaluates tenant request rates against threshold tiers (80% Warning, 95% Critical) and triggers UI badges and webhooks.

## Architecture & Verification
- Server logic: `evaluateTenantQuotaAlert()` in `server/services/rateLimitAlertDispatcher.js`.
- Verification script: `node server/tests/verifyRateLimitAlertDispatcher.js`.
- UI Badge Component: `<RateLimitAlertBadge />`.
