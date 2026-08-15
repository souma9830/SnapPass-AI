import { resizeCanvasPhoto } from '../../utils/clientPhotoResizer';

describe('resizeCanvasPhoto', () => {
    it('resizes canvas smoothly to target resolution', () => {
        const src = document.createElement('canvas');
        src.width = 1000;
        src.height = 1000;
        const resized = resizeCanvasPhoto(src, 600, 600);
        expect(resized.width).toBe(600);
    });
});