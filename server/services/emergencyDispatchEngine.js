
class EmergencyDispatchEngine {
    static dispatchSOS(location) {
        return { dispatched: true, radius: "5km", priority: "HIGH" };
    }
}
module.exports = EmergencyDispatchEngine;
