
class ReferralEngine {
    static evaluate(referrerId, referredId) {
        if (referrerId === referredId) return { rewardAllowed: false, reason: "Self-referral fraud" };
        return { rewardAllowed: true, credit: 20 };
    }
}
module.exports = ReferralEngine;
