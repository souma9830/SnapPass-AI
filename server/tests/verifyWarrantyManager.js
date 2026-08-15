
const engine = require('../services/warrantyManagerEngine');
if (engine.verifyClaim('2026-08-01', '2026-08-30') === true && engine.verifyClaim('2026-09-01', '2026-08-30') === false) {
    console.log("PASSED: Service warranty coverage claim verification verified!");
    process.exit(0);
} else {
    console.error("FAILED Warranty Manager test");
    process.exit(1);
}
