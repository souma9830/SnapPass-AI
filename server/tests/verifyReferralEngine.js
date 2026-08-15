
const engine = require('../services/referralEngine');
if (engine.evaluate("user1", "user1").rewardAllowed === false && engine.evaluate("user1", "user2").credit === 20) {
    console.log("PASSED: Self-referral fraud prevention & promo reward engine verified!");
    process.exit(0);
} else {
    console.error("FAILED Referral Engine test");
    process.exit(1);
}
