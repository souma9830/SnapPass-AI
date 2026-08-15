
const auditor = require('../utils/geofenceAuditor');
if (auditor.validateArrival(100) === true && auditor.validateArrival(600) === false) {
    console.log("PASSED: Geofence arrival radius validation verified!");
    process.exit(0);
} else {
    console.error("FAILED Geofence Auditor test");
    process.exit(1);
}
