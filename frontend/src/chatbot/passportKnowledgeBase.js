/**
 * passportKnowledgeBase.js
 * Embedded knowledge base engine providing country photo specs, official guidelines,
 * and rejection cause answers for the AI Assistant Chatbot.
 */

export const COUNTRY_SPECS = [
  {
    country: 'United States',
    aliases: ['us', 'usa', 'america'],
    size: '2 × 2 inches (51 × 51 mm)',
    background: 'Plain white or off-white',
    headHeight: '1 to 1 3/8 inches (25 to 35 mm)',
    glassesAllowed: false,
    keyRules: 'No glasses, neutral expression, taken within last 6 months.',
  },
  {
    country: 'India',
    aliases: ['in', 'india', 'indian'],
    size: '35 × 45 mm (or 51 × 51 mm for OCI/Visa)',
    background: 'Plain light background (white preferred)',
    headHeight: '70% to 80% of photo height',
    glassesAllowed: false,
    keyRules: 'Full face, front view, eyes open. Ears should be clearly visible.',
  },
  {
    country: 'Schengen / Europe',
    aliases: ['eu', 'europe', 'germany', 'france', 'italy', 'schengen'],
    size: '35 × 45 mm',
    background: 'Light grey or light blue',
    headHeight: '32 to 36 mm (70-80%)',
    glassesAllowed: true,
    keyRules: 'No reflection on lenses, eyes clearly visible, neutral facial expression.',
  },
  {
    country: 'United Kingdom',
    aliases: ['uk', 'britain', 'england'],
    size: '35 × 45 mm',
    background: 'Plain light grey or cream',
    headHeight: '29 to 34 mm',
    glassesAllowed: false,
    keyRules: 'No shadow on face or background, no head covering unless religious.',
  },
];

export function queryKnowledgeBase(userQuery = '') {
  const query = userQuery.toLowerCase().trim();

  const matchedCountry = COUNTRY_SPECS.find(
    (c) =>
      c.country.toLowerCase().includes(query) ||
      c.aliases.some((alias) => query.includes(alias))
  );

  if (matchedCountry) {
    return `📋 **${matchedCountry.country} Passport Photo Rules**:\n- **Dimensions**: ${matchedCountry.size}\n- **Background**: ${matchedCountry.background}\n- **Head Height**: ${matchedCountry.headHeight}\n- **Glasses**: ${matchedCountry.glassesAllowed ? 'Allowed (no reflection)' : 'Strictly Prohibited'}\n- **Key Guidelines**: ${matchedCountry.keyRules}`;
  }

  if (query.includes('glass') || query.includes('spectacle')) {
    return '👓 **Glasses Policy**: Most countries (US, UK, India) prohibit eyeglasses in passport photos to prevent glare and frame obstruction. If required for medical reasons, a signed doctor statement may be needed.';
  }

  if (query.includes('smile') || query.includes('expression')) {
    return '🙂 **Facial Expression**: ICAO guidelines require a neutral facial expression with both eyes open and mouth closed. Smiling with teeth showing is generally rejected.';
  }

  return "I can help with passport photo rules! Try asking about US, India, UK, or Schengen requirements, or ask about glasses and expressions.";
}

export default queryKnowledgeBase;
