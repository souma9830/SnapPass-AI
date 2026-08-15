
const machine = require('../utils/socketHeartbeatMachine');
machine.register('sock_1');
setTimeout(() => {
    machine.sweep(500);
    if (machine.activeSockets.size === 0) {
        console.log("PASSED: WebSocket ghost connection cleanup verified!");
        process.exit(0);
    } else {
        console.error("FAILED WebSocket Heartbeat test");
        process.exit(1);
    }
}, 600);
