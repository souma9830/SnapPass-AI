
const supervisor = require('../config/dbPoolSupervisor');
const queue = require('../utils/dbQueryQueue');
supervisor.disconnect();
const r1 = queue.exec(() => "DATA");
if (r1.queued === true && queue.queue.length === 1) {
    supervisor.reconnect();
    const flushed = queue.flush();
    if (flushed[0] === "DATA") {
        console.log("PASSED: Database reconnector query queue & replay verified!");
        process.exit(0);
    }
}
console.error("FAILED DB Supervisor test");
process.exit(1);
