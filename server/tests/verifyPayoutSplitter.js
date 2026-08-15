
const engine = require('../services/payoutSplitEngine');
const res = engine.calculateSplit(100, 0.15);
if (res.commission === 15 && res.netPayout === 85) {
    console.log("PASSED: Zero-penny loss payout split financial calculation verified!");
    process.exit(0);
} else {
    console.error("FAILED Payout Splitter test");
    process.exit(1);
}
