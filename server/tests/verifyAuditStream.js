
const engine = require('../services/auditStreamEngine');
const model = require('../models/AuditLog');
engine.logEvent({ action: "USER_LOGIN", ip: "127.0.0.1" });
engine.logEvent({ action: "PRIVILEGE_UPDATE", ip: "127.0.0.1" });
if (model.logs.length === 2) {
    console.log("PASSED: Audit log stream buffer auto-flushed successfully!");
    process.exit(0);
} else {
    console.error("FAILED Audit stream test");
    process.exit(1);
}
