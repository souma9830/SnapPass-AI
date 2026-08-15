
exports.getMetrics = (req, res) => res.json({ activeBlocks: 0, rateLimiter: "SlidingWindow" });
