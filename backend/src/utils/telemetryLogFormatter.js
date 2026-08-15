module.exports = {
    formatLog: (level, msg, meta = {}) => JSON.stringify({ level, msg, meta, ts: new Date().toISOString() })
};