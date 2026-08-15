/**
 * Biometric Compliance Verification Service
 * Validates facial spacing ratios against ICAO passport photo criteria.
 */
class BiometricComplianceService {
    constructor(config = {}) {
        this.minRatio = config.minRatio || 0.20;
        this.maxRatio = config.maxRatio || 0.45;
    }

    validateEyeDistance(landmarks, canvasWidth) {
        if (!Array.isArray(landmarks) || landmarks.length < 2) {
            return {
                compliant: false,
                errorCode: 'INVALID_LANDMARKS',
                message: 'Minimum 2 eye landmark coordinates required for analysis.'
            };
        }

        const [left, right] = landmarks;
        const dx = right.x - left.x;
        const dy = right.y - left.y;
        const pixelDistance = Math.sqrt(dx * dx + dy * dy);
        const ratio = pixelDistance / canvasWidth;

        const compliant = ratio >= this.minRatio && ratio <= this.maxRatio;

        return {
            compliant,
            ratio: Number(ratio.toFixed(4)),
            pixelDistance: Number(pixelDistance.toFixed(2)),
            thresholds: { min: this.minRatio, max: this.maxRatio },
            suggestion: compliant ? 'Optimal biometric spacing' : (ratio < this.minRatio ? 'Move camera closer' : 'Step back from camera')
        };
    }
}

module.exports = new BiometricComplianceService();