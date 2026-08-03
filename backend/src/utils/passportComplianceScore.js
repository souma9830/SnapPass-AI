const ITEM_WEIGHTS = {
  face: 20,
  dpi_quality: 15,
  blur: 15,
  dimensions: 15,
  tilt: 10,
  centering: 10,
  background: 10,
  lighting: 5,
  accessories: 5,
  image_read: 25,
};

const DEFAULT_WEIGHT = 5;

const SCORE_THRESHOLDS = {
  PASS: 90,
  ACCEPTABLE: 70,
};

/**
 * Rules-engine scoring for a passport compliance checklist.
 *
 * Starts at 100 and deducts the item weight for each failed check and half the
 * weight for each warning. Returns the 0-100 score, a pass/warn/fail status,
 * per-status counts, and an actionable deduction report.
 *
 * @param {Array<{id: string, title: string, status: string, detail?: string, code?: string}>} items
 * @param {{ hardFail?: boolean }} [options] - Force status to FAIL (e.g. no face detected).
 * @returns {{ score: number, status: string, hardFail: boolean, summary: {pass: number, warn: number, fail: number}, deductions: Array<{item: string, title: string, level: string, points: number, reason: string}> }}
 */
export function computePassportComplianceScore(items = [], { hardFail = false } = {}) {
  const summary = { pass: 0, warn: 0, fail: 0 };
  const deductions = [];
  let totalDeduction = 0;

  for (const item of items) {
    const weight = ITEM_WEIGHTS[item.id] ?? DEFAULT_WEIGHT;

    if (item.status === 'pass' || !['warn', 'fail'].includes(item.status)) {
      if (item.status === 'pass') summary.pass += 1;
      continue;
    }

    if (item.status === 'warn') {
      summary.warn += 1;
      const points = Math.round((weight * 0.5) * 100) / 100;
      totalDeduction += points;
      deductions.push({
        item: item.id,
        title: item.title,
        level: 'warn',
        points,
        reason: item.detail || item.code || 'Item requires attention.',
      });
      continue;
    }

    summary.fail += 1;
    totalDeduction += weight;
    deductions.push({
      item: item.id,
      title: item.title,
      level: 'fail',
      points: weight,
      reason: item.detail || item.code || 'Item failed compliance.',
    });
  }

  const score = Math.max(0, Math.round(100 - totalDeduction));

  let status;
  if (hardFail) {
    status = 'FAIL';
  } else if (score >= SCORE_THRESHOLDS.PASS) {
    status = 'PASS';
  } else if (score >= SCORE_THRESHOLDS.ACCEPTABLE) {
    status = 'ACCEPTABLE';
  } else {
    status = 'FAIL';
  }

  return {
    score,
    status,
    hardFail,
    summary,
    deductions,
  };
}
