
const queueManager = require('../queues/taskQueueManager');
const worker = require('../workers/taskQueueWorker');
async function test() {
    queueManager.addJob({ id: "job_fail", fail: true });
    await worker.processJobs(async (job) => {
        if (job.fail) throw new Error("Processing Error");
    });
    if (queueManager.dlq.length === 1 && queueManager.dlq[0].status === 'DLQ') {
        console.log("PASSED: Job routed to DLQ after exponential retry backoff exhaustion!");
        process.exit(0);
    } else {
        console.error("FAILED DLQ test");
        process.exit(1);
    }
}
test();
