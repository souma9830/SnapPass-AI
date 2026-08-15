
class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 3;
        this.resetTimeout = options.resetTimeout || 5000;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failureCount = 0;
        this.nextAttempt = Date.now();
    }
    async execute(action, fallback) {
        if (this.state === 'OPEN') {
            if (Date.now() > this.nextAttempt) {
                this.state = 'HALF_OPEN';
            } else {
                return fallback();
            }
        }
        try {
            const result = await action();
            this.reset();
            return result;
        } catch (err) {
            this.recordFailure();
            if (fallback) return fallback();
            throw err;
        }
    }
    recordFailure() {
        this.failureCount++;
        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.resetTimeout;
        }
    }
    reset() {
        this.failureCount = 0;
        this.state = 'CLOSED';
    }
}
module.exports = CircuitBreaker;
