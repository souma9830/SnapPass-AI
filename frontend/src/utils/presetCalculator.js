/**
 * Preset Calculator
 * Helper to calculate pixel dimensions from physical millimeter specifications and print grid layouts.
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

export function calculatePrintCapacity(paperSize = '4x6', photoWidthMm = 35, photoHeightMm = 45, spacingMm = 2, marginsMm = 5) {
  const paperDimensions = {
    '4x6': { widthMm: 101.6, heightMm: 152.4, inches: [4, 6] },
    '5x7': { widthMm: 127.0, heightMm: 177.8, inches: [5, 7] },
    'A4': { widthMm: 210.0, heightMm: 297.0, inches: [8.27, 11.69] },
    'letter': { widthMm: 215.9, heightMm: 279.4, inches: [8.5, 11] },
  };

  const paper = paperDimensions[paperSize.toLowerCase()] || paperDimensions['4x6'];
  const availW = paper.widthMm - marginsMm * 2;
  const availH = paper.heightMm - marginsMm * 2;

  const cols = Math.max(1, Math.floor((availW + spacingMm) / (photoWidthMm + spacingMm)));
  const rows = Math.max(1, Math.floor((availH + spacingMm) / (photoHeightMm + spacingMm)));

  return {
    cols,
    rows,
    totalCapacity: cols * rows,
    paperWidthMm: paper.widthMm,
    paperHeightMm: paper.heightMm,
    inches: paper.inches,
  };
}
