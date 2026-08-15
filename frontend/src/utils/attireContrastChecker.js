export const checkAttireBackgroundContrast = (attireHex, backgroundHex) => {
    const hexToRgb = (hex) => {
        const sanitized = hex.replace('#', '');
        const bigint = parseInt(sanitized, 16);
        return [ (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255 ];
    };

    const getLuminance = (r, g, b) => {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    try {
        const l1 = getLuminance(...hexToRgb(attireHex));
        const l2 = getLuminance(...hexToRgb(backgroundHex));
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const isCompliant = ratio >= 3.0;

        return {
            ratio: Number(ratio.toFixed(2)),
            isCompliant,
            recommendation: isCompliant 
                ? 'Sufficient color contrast relative to background.' 
                : 'Attire color blends into background. Darker attire recommended.'
        };
    } catch (e) {
        return { ratio: 1.0, isCompliant: false, recommendation: 'Invalid hex color input.' };
    }
};