
const limiter = require('../middleware/slidingWindowRateLimiter')(2, 5000);
let req = { ip: '192.168.1.1' }, res = { status: (s) => ({ json: (d) => ({ status: s, data: d }) }) };
let passed = 0;
limiter(req, res, () => passed++);
limiter(req, res, () => passed++);
let blocked = limiter(req, res, () => passed++);
if (passed === 2 && blocked.status === 429) {
    console.log("PASSED: Sliding window rate limiter burst protection verified!");
    process.exit(0);
} else {
    console.error("FAILED Rate Limiter test");
    process.exit(1);
}
