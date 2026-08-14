/**
 * Server-side attire swap template catalog and alignment metadata engine
 */

export function getAttireTemplateMetadata(attireId) {
  const metadataMap = {
    suit_black: { maskWidthPct: 65, shoulderYOffsetPx: 120, defaultScaleFactor: 1.0 },
    suit_navy: { maskWidthPct: 68, shoulderYOffsetPx: 125, defaultScaleFactor: 1.02 },
    blazer_grey: { maskWidthPct: 66, shoulderYOffsetPx: 118, defaultScaleFactor: 0.98 },
    women_blazer_black: { maskWidthPct: 62, shoulderYOffsetPx: 110, defaultScaleFactor: 0.95 },
    women_suit_navy: { maskWidthPct: 64, shoulderYOffsetPx: 112, defaultScaleFactor: 0.96 }
  };

  return metadataMap[attireId] || { maskWidthPct: 65, shoulderYOffsetPx: 120, defaultScaleFactor: 1.0 };
}
