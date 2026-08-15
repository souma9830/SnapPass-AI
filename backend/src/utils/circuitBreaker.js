import EventEmitter from 'events';

export class CircuitBreaker extends EventEmitter {
  constructor(options = {}) {
    super();
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF-OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(fn, ...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF-OPEN';
      } else {
        throw new Error('CircuitBreakerOpen: Service is temporarily unavailable due to consecutive failures');
      }
    }

    try {
      const result = await fn(...args);
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure(err);
      throw err;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.emit('success');
  }

  onFailure(err) {
    this.failureCount += 1;
    this.emit('failure', err);
    if (this.failureCount >= this.failureThreshold || this.state === 'HALF-OPEN') {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      this.emit('open');
    }
  }

  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      nextAttempt: this.nextAttempt
    };
  }
}
