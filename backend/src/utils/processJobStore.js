// Simple in-memory job store for async AI processing.
// NOTE: In production, replace with Redis or a durable queue.

import crypto from 'crypto';

const jobs = new Map();

export function createJob({ payload }) {
  const jobId = crypto.randomUUID();
  jobs.set(jobId, {
    id: jobId,
    status: 'queued',
    progress: 0,
    stage: '',
    createdAt: Date.now(),
    payload,
    processedUrl: null,
    error: null,
  });
  return jobId;
}

export function getJob(jobId) {
  return jobs.get(jobId) || null;
}

export function updateJob(jobId, patch) {
  const job = jobs.get(jobId);
  if (!job) return null;
  const next = { ...job, ...patch };
  jobs.set(jobId, next);
  return next;
}

export function clearJob(jobId) {
  jobs.delete(jobId);
}

