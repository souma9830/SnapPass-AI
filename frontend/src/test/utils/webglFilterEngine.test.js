import { WebGLFilterEngine } from '../../utils/webglFilterEngine';

describe('WebGLFilterEngine', () => {
    it('gracefully handles unsupported WebGL contexts in mock environment', () => {
        const canvas = document.createElement('canvas');
        const engine = new WebGLFilterEngine(canvas);
        expect(engine).toBeDefined();
        expect(typeof engine.render).toBe('function');
    });
});