class HeadPoseValidationService {
    validatePoseAngles(angles, maxAllowed = 5.0) {
        const { pitch = 0, yaw = 0, roll = 0 } = angles || {};
        const maxAngle = Math.max(Math.abs(pitch), Math.abs(yaw), Math.abs(roll));
        const compliant = maxAngle <= maxAllowed;

        return {
            isCompliant: compliant,
            maxAngle: Number(maxAngle.toFixed(2)),
            threshold: maxAllowed,
            details: { pitch, yaw, roll },
            guidance: compliant ? 'Head position is straight' : 'Keep your head straight facing the camera'
        };
    }
}
module.exports = new HeadPoseValidationService();