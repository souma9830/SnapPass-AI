
const verifier = require('../services/accreditationVerifier');
if (verifier.verifyDocument({ validDate: true }).badge === "TRUSTED_PRO") {
    console.log("PASSED: Worker accreditation verification verified!");
    process.exit(0);
} else {
    console.error("FAILED Accreditation test");
    process.exit(1);
}
