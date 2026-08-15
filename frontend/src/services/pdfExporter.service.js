import { calculateDpiScale } from '../utils/dpiScalingUtil';

export async function exportSheetToPdf(canvasElement, dpi = 300) {
  if (!canvasElement) throw new Error('Canvas element required');
  const dataUrl = canvasElement.toDataURL('image/png');
  return { success: true, dataUrl, dpi };
}
