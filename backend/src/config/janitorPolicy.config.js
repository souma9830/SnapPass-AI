/**
 * janitorPolicy.config.js — Storage retention rules per file classification.
 */

export const JANITOR_RETENTION_POLICY = {
  tempUploadsMs: 24 * 60 * 60 * 1000, // 24 hours
  processedExportsMs: 48 * 60 * 60 * 1000, // 48 hours
  batchArchivesMs: 12 * 60 * 60 * 1000, // 12 hours
};

export const isFileExpired = (mtimeMs, category = 'tempUploadsMs') => {
  const ttl = JANITOR_RETENTION_POLICY[category] || JANITOR_RETENTION_POLICY.tempUploadsMs;
  return Date.now() - mtimeMs > ttl;
};
