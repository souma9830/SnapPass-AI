import { HistogramChannelBins, ExposureAnalysisStats } from '../types/histogram';

export function calculateCanvasHistogram(ctx: CanvasRenderingContext2D, width: number, height: number): {
  bins: HistogramChannelBins;
  stats: ExposureAnalysisStats;
} {
  const imgData = ctx.getImageData(0, 0, width, height).data;
  const red = new Array(256).fill(0);
  const green = new Array(256).fill(0);
  const blue = new Array(256).fill(0);
  const luminance = new Array(256).fill(0);

  let totalLuminance = 0;
  let underCount = 0;
  let overCount = 0;
  const totalPixels = width * height;

  for (let i = 0; i < imgData.length; i += 4) {
    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];
    const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    red[r]++;
    green[g]++;
    blue[b]++;
    luminance[lum]++;

    totalLuminance += lum;
    if (lum < 15) underCount++;
    if (lum > 240) overCount++;
  }

  const underExposedPercentage = Number(((underCount / totalPixels) * 100).toFixed(1));
  const overExposedPercentage = Number(((overCount / totalPixels) * 100).toFixed(1));
  const meanLuminance = Math.round(totalLuminance / totalPixels);

  return {
    bins: { red, green, blue, luminance },
    stats: {
      underExposedPercentage,
      overExposedPercentage,
      isExposureCompliant: underExposedPercentage < 5.0 && overExposedPercentage < 5.0,
      meanLuminance,
    },
  };
}
