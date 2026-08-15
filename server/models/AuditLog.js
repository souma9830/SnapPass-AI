
class AuditLogModel {
    constructor() { this.logs = []; }
    insertMany(records) { this.logs.push(...records); }
}
module.exports = new AuditLogModel();
