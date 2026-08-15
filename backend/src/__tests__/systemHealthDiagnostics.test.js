const { getDiagnostics } = require('../controllers/systemHealthDiagnostics.controller');

describe('systemHealthDiagnostics', () => {
    it('returns status UP', () => {
        const res = { json: jest.fn() };
        getDiagnostics({}, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'UP' }));
    });
});