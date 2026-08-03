import Fuse from 'fuse.js';
import { knowledgeBase } from '../data/knowledgeBase';
import { knowledgeBaseHi } from '../data/knowledgeBaseHi';

const fuse = new Fuse(knowledgeBase, {
  keys: [
    { name: 'question', weight: 0.6 },
    { name: 'keywords', weight: 0.3 },
    { name: 'answer', weight: 0.1 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
  distance: 200,
});

const fuseHi = new Fuse(knowledgeBaseHi, {
  keys: [
    { name: 'question', weight: 0.6 },
    { name: 'keywords', weight: 0.3 },
    { name: 'answer', weight: 0.1 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
  distance: 200,
});

const HAS_DEVANAGARI = /[\u0900-\u097F]/;

const HINDI_FALLBACK =
  'मैं केवल SnapPass AI सुविधाओं, पासपोर्ट फोटो दिशानिर्देशों और संपादन उपकरणों से संबंधित प्रश्नों का उत्तर दे सकता हूँ।';
const HINDI_NOT_SURE = (suggestions) =>
  `मुझे पूरी तरह से यकीन नहीं है। क्या आपका मतलब है: ${suggestions}?`;

const exactKeywordMatch = (database, lowerQuery) => {
  for (const item of database) {
    const matchedKeyword = item.keywords.some((keyword) =>
      lowerQuery.includes(keyword.toLowerCase())
    );
    if (matchedKeyword) {
      return item.answer;
    }
  }
  return null;
};

export const searchResponse = (query) => {
  if (!query || !query.trim()) {
    return 'Please ask a question related to SnapPass AI.';
  }

  const lowerQuery = query.toLowerCase().trim();

  // Hindi query routing → search the Hindi knowledge base
  if (HAS_DEVANAGARI.test(lowerQuery)) {
    const exact = exactKeywordMatch(knowledgeBaseHi, lowerQuery);
    if (exact) return exact;

    const results = fuseHi.search(query);
    if (results.length > 0 && results[0].score <= 0.4) {
      return results[0].item.answer;
    }
    if (results.length > 0 && results[0].score <= 0.65) {
      const suggestions = results
        .slice(0, 3)
        .map((r) => r.item.question)
        .join('; ');
      return HINDI_NOT_SURE(suggestions);
    }
    return HINDI_FALLBACK;
  }

  // STEP 1 → Exact keyword matching (highest confidence)
  const exact = exactKeywordMatch(knowledgeBase, lowerQuery);
  if (exact) {
    return exact;
  }

  // STEP 2 → Fuse fuzzy fallback with tighter threshold
  const results = fuse.search(query);

  if (results.length > 0 && results[0].score <= 0.4) {
    return results[0].item.answer;
  }

  // STEP 3 → Provide suggestions for low-confidence matches
  if (results.length > 0 && results[0].score <= 0.65) {
    const suggestions = results
      .slice(0, 3)
      .map((r) => r.item.question)
      .join('; ');
    return `I'm not entirely sure about that. Did you mean: ${suggestions}?`;
  }

  // STEP 4 → Reject unrelated questions with helpful fallback
  return 'I can only answer questions related to SnapPass AI features, passport photo guidelines, and editing tools.';
};

export const searchMultiResponse = (query, topN = 3) => {
  if (!query || !query.trim()) return [];

  const lowerQuery = query.toLowerCase().trim();
  const database = HAS_DEVANAGARI.test(lowerQuery) ? knowledgeBaseHi : knowledgeBase;
  const engine = HAS_DEVANAGARI.test(lowerQuery) ? fuseHi : fuse;

  const exactMatches = database.filter((item) =>
    item.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()))
  );

  if (exactMatches.length > 0) return exactMatches.slice(0, topN);

  const results = engine.search(query);
  return results
    .filter((r) => r.score <= 0.5)
    .slice(0, topN)
    .map((r) => r.item);
};
