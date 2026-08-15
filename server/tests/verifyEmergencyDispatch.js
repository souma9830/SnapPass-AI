
const engine = require('../services/emergencyDispatchEngine');
const res = engine.dispatchSOS({ lat: 10, lng: 10 });
if (res.dispatched && res.priority === "HIGH") {
    console.log("PASSED: Emergency priority dispatch verified!");
    process.exit(0);
} else {
    console.error("FAILED Emergency Dispatch test");
    process.exit(1);
}
