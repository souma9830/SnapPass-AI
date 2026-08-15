
class DbPoolSupervisor {
    constructor() { this.connected = true; }
    disconnect() { this.connected = false; }
    reconnect() { this.connected = true; }
}
module.exports = new DbPoolSupervisor();
