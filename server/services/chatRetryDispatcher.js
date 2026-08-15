
const tracker = require('../utils/chatDeliveryTracker');
class ChatRetryDispatcher {
    static retryMessage(msgId) {
        if (tracker.hasPending(msgId)) return { redelivered: true };
        return { redelivered: false };
    }
}
module.exports = ChatRetryDispatcher;
