import { validateImageFile } from './fileValidation';

describe('validateImageFile', () => {
    it('should reject empty files', () => {
        const result = validateImageFile(null);
        expect(result.valid).toBe(false);
    });
    it('should validate standard images', () => {
        const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const result = validateImageFile(file);
        expect(result.valid).toBe(true);
    });
});
