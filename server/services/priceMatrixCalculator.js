
class PriceMatrixCalculator {
    static calculate({ baseRate = 50, urgencyMultiplier = 1.2, hours = 2 }) {
        return (baseRate * hours) * urgencyMultiplier;
    }
}
module.exports = PriceMatrixCalculator;
