/**
 * Shared photo size presets used across models and controllers.
 * Centralized to prevent duplication and ensure consistency.
 */

export const PHOTO_SIZE_PRESETS = ["35x45", "51x51", "33x48", "40x60", "2x2in", "100x150", "25x25", "50x70", "45x45", "35x50"];

export const PHOTO_SIZE_DETAILS = [
  { id: "35x45", label: "35×45 mm (India / UK)", widthMm: 35, heightMm: 45 },
  { id: "51x51", label: "51×51 mm (USA Visa)", widthMm: 51, heightMm: 51 },
  { id: "33x48", label: "33×48 mm (Schengen Visa)", widthMm: 33, heightMm: 48 },
  { id: "40x60", label: "40×60 mm (China Visa)", widthMm: 40, heightMm: 60 },
  { id: "2x2in", label: '2×2 inch (US Passport)', widthMm: 50.8, heightMm: 50.8 },
  { id: "100x150", label: "100×150 mm (Postcard Size)", widthMm: 100, heightMm: 150 },
  { id: "25x25", label: "25×25 mm (Stamp Size)", widthMm: 25, heightMm: 25 },
  { id: "50x70", label: "50×70 mm (Canada Passport)", widthMm: 50, heightMm: 70 },
  { id: "45x45", label: "45×45 mm (Japan Passport / Visa)", widthMm: 45, heightMm: 45 },
  { id: "35x50", label: "35×50 mm (Malaysia Passport)", widthMm: 35, heightMm: 50 },
];
