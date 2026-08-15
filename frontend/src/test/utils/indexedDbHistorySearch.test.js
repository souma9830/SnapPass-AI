import { filterHistory } from '../../utils/indexedDbHistorySearch';

describe('filterHistory', () => {
    it('filters items', () => {
        expect(filterHistory([{ name: 'US Visa' }], 'us').length).toBe(1);
    });
});