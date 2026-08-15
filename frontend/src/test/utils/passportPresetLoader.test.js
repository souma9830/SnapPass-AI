import { getPassportPreset } from '../../utils/passportPresetLoader';

describe('passportPresetLoader', () => {
    it('retrieves accurate dimensions for US preset', () => {
        const preset = getPassportPreset('US');
        expect(preset.widthMm).toBe(51);
        expect(preset.heightMm).toBe(51);
    });
});