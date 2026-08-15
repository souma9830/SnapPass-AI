
class DisputeWorkflowEngine {
    constructor() { this.state = 'SUBMITTED'; }
    transition(nextState) {
        const allowed = { 'SUBMITTED': ['UNDER_REVIEW'], 'UNDER_REVIEW': ['RESOLVED'] };
        if (allowed[this.state] && allowed[this.state].includes(nextState)) {
            this.state = nextState;
            return true;
        }
        return false;
    }
}
module.exports = DisputeWorkflowEngine;
