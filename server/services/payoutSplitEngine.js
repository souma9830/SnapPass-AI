
class PayoutSplitEngine {
    static calculateSplit(grossAmount, commissionRate = 0.15) {
        const commission = Math.round(grossAmount * commissionRate * 100) / 100;
        const netPayout = Math.round((grossAmount - commission) * 100) / 100;
        return { grossAmount, commission, netPayout };
    }
}
module.exports = PayoutSplitEngine;
