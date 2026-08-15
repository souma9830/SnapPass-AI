export function calculateDpiScale(mmVal, targetDpi = 300) {
  const inches = mmVal / 25.4;
  return Math.round(inches * targetDpi);
}
