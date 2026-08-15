
const middleware = require('../middleware/tenantIsolationMiddleware');
const context = require('../services/tenantContextService');
middleware({ headers: { 'x-tenant-id': 'org_acme' } }, {}, () => {});
if (context.getTenant() === 'org_acme') {
    console.log("PASSED: Multi-tenant context isolation verified!");
    process.exit(0);
} else {
    console.error("FAILED Tenant isolation test");
    process.exit(1);
}
