
class SocketHeartbeatMachine {
    constructor() { this.activeSockets = new Map(); }
    register(id) { this.activeSockets.set(id, Date.now()); }
    ping(id) { if (this.activeSockets.has(id)) this.activeSockets.set(id, Date.now()); }
    sweep(timeout = 1000) {
        const now = Date.now();
        for (let [id, last] of this.activeSockets.entries()) {
            if (now - last > timeout) this.activeSockets.delete(id);
        }
    }
}
module.exports = new SocketHeartbeatMachine();
