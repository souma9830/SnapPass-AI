
const auditModel = require('../models/AuditLog');
class AuditStreamEngine {
    constructor() {
        this.buffer = [];
    }
    logEvent(event) {
        this.buffer.push({ ...event, timestamp: new Date() });
        if (this.buffer.length >= 2) this.flush();
    }
    flush() {
        auditModel.insertMany(this.buffer);
        this.buffer = [];
    }
}
module.exports = new AuditStreamEngine();
