
const queueManager = require('../queues/taskQueueManager');
class TaskQueueWorker {
    static async processJobs(handler) {
        while(queueManager.queue.length > 0) {
            const job = queueManager.queue.shift();
            try {
                await handler(job);
                job.status = 'COMPLETED';
            } catch (err) {
                job.attempts++;
                if (job.attempts < 3) {
                    queueManager.queue.push(job);
                } else {
                    job.status = 'DLQ';
                    queueManager.dlq.push(job);
                }
            }
        }
    }
}
module.exports = TaskQueueWorker;
