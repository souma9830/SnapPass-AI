/**
 * Dynamic Multi-Country Custom Print Grid & Bleed Margin Calculation Engine.
 */

export const PAPER_SIZES = {
  A4: { widthMm: 210, heightMm: 297 },
  A6_4x6in: { widthMm: 101.6, heightMm: 152.4 },
  US_LETTER: { widthMm: 215.9, heightMm: 279.4 }
};

export const calculateGridCapacity = (paperKey, photoWidthMm, photoHeightMm, marginMm = 3) => {
  const paper = PAPER_SIZES[paperKey] || PAPER_SIZES.A6_4x6in;
  const availableWidth = paper.widthMm - (marginMm * 2);
  const availableHeight = paper.heightMm - (marginMm * 2);

  const cols = Math.floor(availableWidth / (photoWidthMm + marginMm));
  const rows = Math.floor(availableHeight / (photoHeightMm + marginMm));
  const totalPhotos = Math.max(1, cols * rows);

  return {
    cols,
    rows,
    totalPhotos,
    paperWidthMm: paper.widthMm,
    paperHeightMm: paper.heightMm,
    bleedMarginMm: marginMm
  };
};
