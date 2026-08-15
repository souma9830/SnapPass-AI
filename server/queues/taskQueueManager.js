
class TaskQueueManager {
    constructor() {
        this.queue = [];
        this.dlq = [];
    }
    addJob(job) {
        this.queue.push({ ...job, attempts: 0 });
    }
}
module.exports = new TaskQueueManager();
