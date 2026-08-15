
const tracker = require('../utils/chatDeliveryTracker');
const dispatcher = require('../services/chatRetryDispatcher');
tracker.track('m1', 'Hello');
if (dispatcher.retryMessage('m1').redelivered === true) {
    tracker.ack('m1');
    if (dispatcher.retryMessage('m1').redelivered === false) {
        console.log("PASSED: Chat exponential retry dispatch & ack tracking verified!");
        process.exit(0);
    }
}
console.error("FAILED Chat Retry test");
process.exit(1);
