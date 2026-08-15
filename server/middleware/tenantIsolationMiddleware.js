
const tenantContext = require('../services/tenantContextService');
module.exports = (req, res, next) => {
    const tenantId = req.headers['x-tenant-id'] || 'default';
    tenantContext.setTenant(tenantId);
    next();
};
