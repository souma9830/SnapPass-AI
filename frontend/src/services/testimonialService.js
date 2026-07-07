import api from './api';
import { getReviewFingerprint } from '../utils/reviewClient';
import { SAMPLE_TESTIMONIALS, FALLBACK_STATS } from '../data/testimonials';

function buildFallbackPayload() {
  return {
    testimonials: SAMPLE_TESTIMONIALS,
    stats: { ...FALLBACK_STATS },
    userReview: null,
  };
}

export async function fetchTestimonials() {
  const fingerprint = getReviewFingerprint();

  if (!import.meta.env.VITE_API_URL) {
    return buildFallbackPayload();
  }

  try {
    const { data } = await api.get('/testimonials', {
      params: { fingerprint },
      headers: { 'X-Client-Fingerprint': fingerprint },
    });

    return data.data;
  } catch {
    return buildFallbackPayload();
  }
}

function ensureApiConfigured() {
  if (!import.meta.env.VITE_API_URL) {
    throw new Error(
      'Review submission is unavailable until the backend API is configured.'
    );
  }
}

export async function submitTestimonial(payload) {
  ensureApiConfigured();
  const clientFingerprint = getReviewFingerprint();
  const { data } = await api.post('/testimonials', {
    ...payload,
    clientFingerprint,
    website: payload.website || '',
  });

  return data.data.testimonial;
}

export async function updateTestimonial(payload) {
  ensureApiConfigured();
  const clientFingerprint = getReviewFingerprint();
  const { data } = await api.put('/testimonials', {
    ...payload,
    clientFingerprint,
    website: payload.website || '',
  });

  return data.data.testimonial;
}
