
const ExternalGatewayService = require('../services/externalGatewayService');
async function runTest() {
    console.log("Testing Circuit Breaker Transitions...");
    let res1 = await ExternalGatewayService.processPayment({ simulateFailure: false });
    console.log("Success Call:", res1);
    let res2 = await ExternalGatewayService.processPayment({ simulateFailure: true });
    console.log("Failure Call 1:", res2);
    let res3 = await ExternalGatewayService.processPayment({ simulateFailure: true });
    console.log("Failure Call 2 (Triggers OPEN):", res3);
    let res4 = await ExternalGatewayService.processPayment({ simulateFailure: false });
    console.log("Fast-Fail Fallback (OPEN State):", res4);
    if (res4.fallback === true) {
        console.log("PASSED: Circuit Breaker fast-fail verified!");
        process.exit(0);
    } else {
        console.error("FAILED Circuit Breaker test");
        process.exit(1);
    }
}
runTest();
