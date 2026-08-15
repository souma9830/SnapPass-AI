
class LoyaltyRewardEngine {
    static calculatePoints(basePoints, tier) {
        const multipliers = { 'BRONZE': 1.0, 'SILVER': 1.25, 'GOLD': 1.5, 'VIP': 2.0 };
        return basePoints * (multipliers[tier] || 1.0);
    }
}
module.exports = LoyaltyRewardEngine;
