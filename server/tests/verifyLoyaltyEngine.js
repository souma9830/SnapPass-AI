
const engine = require('../services/loyaltyRewardEngine');
if (engine.calculatePoints(100, 'VIP') === 200) {
    console.log("PASSED: Loyalty reward multiplier calculation verified!");
    process.exit(0);
} else {
    console.error("FAILED Loyalty Engine test");
    process.exit(1);
}
