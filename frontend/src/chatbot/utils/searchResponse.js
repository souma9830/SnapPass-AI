import Fuse from "fuse.js";
import { knowledgeBase } from "../data/knowledgeBase";

const fuse = new Fuse(knowledgeBase, {
    keys: [
        { name: "question", weight: 0.6 },
        { name: "keywords", weight: 0.3 },
        { name: "answer", weight: 0.1 }
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2,
    distance: 200,
});

export const searchResponse = (query) => {
    if (!query.trim()) {
        return "Please ask a question related to SnapPass AI.";
    }

    const lowerQuery = query.toLowerCase();

    // STEP 1 → Exact keyword matching (highest confidence)
    for (const item of knowledgeBase) {
        const matchedKeyword = item.keywords.some((keyword) =>
            lowerQuery.includes(keyword.toLowerCase())
        );
        if (matchedKeyword) {
            return item.answer;
        }
    }

    // STEP 2 → Fuse fuzzy fallback with tighter threshold
    const results = fuse.search(query);

    if (results.length > 0 && results[0].score <= 0.4) {
        return results[0].item.answer;
    }

    // STEP 3 → Provide suggestions for low-confidence matches
    if (results.length > 0 && results[0].score <= 0.65) {
        const suggestions = results.slice(0, 3).map(r => r.item.question).join(", ");
        return `I'm not entirely sure about that. Did you mean: ${suggestions}?`;
    }

    // STEP 4 → Reject unrelated questions with helpful fallback
    return "I can only answer questions related to SnapPass AI features and tools.";
};

export const searchMultiResponse = (query, topN = 3) => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const exactMatches = knowledgeBase.filter(item =>
        item.keywords.some(kw => lowerQuery.includes(kw.toLowerCase()))
    );

    if (exactMatches.length > 0) return exactMatches.slice(0, topN);

    const results = fuse.search(query);
    return results
        .filter(r => r.score <= 0.5)
        .slice(0, topN)
        .map(r => r.item);
};
