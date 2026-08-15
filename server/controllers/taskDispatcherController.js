
const queueManager = require('../queues/taskQueueManager');
exports.dispatchTask = (req, res) => {
    const job = { id: "job_" + Date.now(), data: req.body };
    queueManager.addJob(job);
    res.json({ message: "Job queued", job });
};
