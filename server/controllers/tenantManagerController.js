
const tenantContext = require('../services/tenantContextService');
exports.getTenantScope = (req, res) => res.json({ tenantId: tenantContext.getTenant() });
