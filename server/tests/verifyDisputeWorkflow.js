
const Engine = require('../services/disputeWorkflowEngine');
const engine = new Engine();
if (engine.transition('UNDER_REVIEW') && engine.transition('RESOLVED')) {
    console.log("PASSED: Dispute workflow state machine transitions verified!");
    process.exit(0);
} else {
    console.error("FAILED Dispute Workflow test");
    process.exit(1);
}
