/**
 * Preset Calculator
 * Helper to calculate pixel dimensions from physical millimeter specifications.
 */

export function calculatePixels(widthMm, heightMm, dpi = 300) {
  const mmPerInch = 25.4;
  const widthPx = Math.round((widthMm / mmPerInch) * dpi);
  const heightPx = Math.round((heightMm / mmPerInch) * dpi);
  return { widthPx, heightPx };
}

export function getAspectratio(widthMm, heightMm) {
  if (!widthMm || !heightMm) return 1;
  return widthMm / heightMm;
}

export function getComplianceGuidelines(country) {
  const guidelines = {
    us: [
      "2x2 inches (51x51 mm) dimensions",
      "Head height must be between 1 and 1 3/8 inches (25-35 mm)",
      "Background must be plain white or off-white",
      "No glasses, hats, or uniform attire allowed"
    ],
    india: [
      "35x45 mm dimensions",
      "Face should cover 70-80% of the photo",
      "Background must be plain light colored, preferably white",
      "No shadows on the face or background"
    ],
    uk: [
      "35x45 mm dimensions",
      "Must be taken against a cream or light grey background",
      "No head coverings unless for religious/medical reasons",
      "Neutral expression with closed mouth"
    ]
  };
  return guidelines[country.toLowerCase()] || ["Standard passport specifications apply."];
}
