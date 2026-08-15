/**
 * slidingWindow.utils.js — Sliding window calculation helper.
 */

export const calculateSlidingWeight = (currentCount, previousCount, elapsedInWindowMs, windowSizeMs) => {
  const previousWeight = Math.max(0, (windowSizeMs - elapsedInWindowMs) / windowSizeMs);
  return Math.floor(previousCount * previousWeight + currentCount);
};
