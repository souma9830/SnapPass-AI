
const CircuitBreaker = require('../utils/circuitBreaker');
const breaker = new CircuitBreaker({ failureThreshold: 2, resetTimeout: 3000 });

class ExternalGatewayService {
    static async processPayment(payload) {
        return breaker.execute(
            async () => {
                if (payload.simulateFailure) throw new Error("Gateway Error");
                return { success: true, transactionId: "TXN_" + Date.now() };
            },
            () => ({ success: false, fallback: true, message: "Payment Gateway currently degraded. Fast-failing payload." })
        );
    }
}
module.exports = ExternalGatewayService;
