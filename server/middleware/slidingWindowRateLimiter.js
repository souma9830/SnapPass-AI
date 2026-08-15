
const logs = new Map();
module.exports = (limit = 3, windowMs = 10000) => (req, res, next) => {
    const ip = req.ip || '127.0.0.1';
    const now = Date.now();
    if (!logs.has(ip)) logs.set(ip, []);
    const timestamps = logs.get(ip).filter(t => now - t < windowMs);
    if (timestamps.length >= limit) {
        return res.status(429).json({ error: "Rate limit exceeded (sliding window)" });
    }
    timestamps.push(now);
    logs.set(ip, timestamps);
    next();
};
