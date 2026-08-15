
const buffer = new Map();
module.exports = {
    track: (msgId, payload) => buffer.set(msgId, payload),
    ack: (msgId) => buffer.delete(msgId),
    hasPending: (msgId) => buffer.has(msgId)
};
