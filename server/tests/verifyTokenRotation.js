
const RefreshTokenService = require('../services/refreshTokenService');
try {
    const t1 = "token_abc_123";
    const res1 = RefreshTokenService.rotateToken(t1);
    console.log("Rotated Token 1 ->", res1);
    try {
        RefreshTokenService.rotateToken(t1);
        console.error("FAILED: Replay attack allowed!");
        process.exit(1);
    } catch (e) {
        console.log("PASSED: Token replay blocked successfully!");
        process.exit(0);
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}
