import { describe, it, expect } from 'vitest';
import { queryKnowledgeBase, COUNTRY_SPECS } from '../../chatbot/passportKnowledgeBase';

describe('passportKnowledgeBase chatbot utility', () => {
  it('returns US passport photo specifications when queried', () => {
    const result = queryKnowledgeBase('united states');
    expect(result).toContain('2 × 2 inches');
    expect(result).toContain('Plain white');
  });

  it('answers glasses query correctly', () => {
    const result = queryKnowledgeBase('Can I wear glasses?');
    expect(result).toContain('Glasses Policy');
  });

  it('provides default fallback message for unmatched query', () => {
    const result = queryKnowledgeBase('random unknown question');
    expect(result).toContain('I can help with passport photo rules');
  });
});
