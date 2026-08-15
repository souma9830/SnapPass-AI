
const supervisor = require('../config/dbPoolSupervisor');
class DbQueryQueue {
    constructor() { this.queue = []; }
    exec(query) {
        if (!supervisor.connected) {
            this.queue.push(query);
            return { queued: true };
        }
        return { queued: false, result: query() };
    }
    flush() {
        const res = this.queue.map(q => q());
        this.queue = [];
        return res;
    }
}
module.exports = new DbQueryQueue();
