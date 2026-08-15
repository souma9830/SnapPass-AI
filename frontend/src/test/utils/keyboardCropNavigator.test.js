import { handleCropKeyNavigation } from '../../utils/keyboardCropNavigator';

describe('handleCropKeyNavigation', () => {
    it('shifts crop area horizontally upon ArrowRight key press', () => {
        const crop = { x: 50, y: 50, width: 100, height: 100 };
        const updated = handleCropKeyNavigation(crop, 'ArrowRight', 10);
        expect(updated.x).toBe(60);
    });

    it('expands crop dimensions upon + key press', () => {
        const crop = { x: 50, y: 50, width: 100, height: 100 };
        const updated = handleCropKeyNavigation(crop, '+', 5);
        expect(updated.width).toBe(105);
    });
});