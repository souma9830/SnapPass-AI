
const calc = require('../services/priceMatrixCalculator');
const res = calc.calculate({ baseRate: 100, urgencyMultiplier: 1.5, hours: 2 });
if (res === 300) {
    console.log("PASSED: Price estimate matrix formula verified!");
    process.exit(0);
} else {
    console.error("FAILED Price Calculator test");
    process.exit(1);
}
