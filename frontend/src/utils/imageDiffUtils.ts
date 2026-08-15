import { PixelDiffStats } from '../types/comparison';

export function calculatePixelDifference(
  ctxOriginal: CanvasRenderingContext2D,
  ctxEdited: CanvasRenderingContext2D,
  width: number,
  height: number,
  sensitivityThreshold = 30
): PixelDiffStats {
  const imgDataOrig = ctxOriginal.getImageData(0, 0, width, height).data;
  const imgDataEdit = ctxEdited.getImageData(0, 0, width, height).data;
  const totalPixels = width * height;
  let changedPixels = 0;

  for (let i = 0; i < imgDataOrig.length; i += 4) {
    const rDiff = Math.abs(imgDataOrig[i] - imgDataEdit[i]);
    const gDiff = Math.abs(imgDataOrig[i + 1] - imgDataEdit[i + 1]);
    const bDiff = Math.abs(imgDataOrig[i + 2] - imgDataEdit[i + 2]);

    if (rDiff + gDiff + bDiff > sensitivityThreshold) {
      changedPixels++;
    }
  }

  const changePercentage = Number(((changedPixels / totalPixels) * 100).toFixed(2));

  return {
    totalPixels,
    changedPixels,
    changePercentage,
    significantDiffDetected: changePercentage > 5.0,
  };
}

export function clampSplitPosition(value: number, min = 0, max = 100): number {
  return Math.min(Math.max(value, min), max);
}
