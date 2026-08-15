import AppError from "../utils/errors/AppError.js";
import { SEED_TESTIMONIALS } from "../data/seedTestimonials.js";
import * as testimonialDao from "../dao/testimonial.dao.js";

const IP_REVIEW_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_REVIEWS_PER_IP_PER_DAY = 3;

function formatTestimonial(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    rating: doc.rating,
    comment: doc.comment,
    commentEn: doc.comment,
    commentHi: doc.commentHi || "",
    date: doc.createdAt,
    isOwn: Boolean(doc.isOwn),
  };
}

function calculateStats(testimonials) {
  if (!testimonials.length) {
    return { averageRating: 0, count: 0 };
  }

  const sum = testimonials.reduce((acc, item) => acc + item.rating, 0);
  return {
    averageRating: Number((sum / testimonials.length).toFixed(1)),
    count: testimonials.length,
  };
}

export async function ensureSeedTestimonials() {
  const count = await testimonialDao.countTestimonials();
  if (count > 0) return;

  try {
    await testimonialDao.insertSeedTestimonials(SEED_TESTIMONIALS);
  } catch (error) {
    if (error?.code !== 11000) {
      throw error;
    }
  }
}

/**
 * Fetch approved testimonials with pagination support.
 * @param {string|null} clientFingerprint
 * @param {{page?: number, limit?: number}} options
 */
export async function getApprovedTestimonials(clientFingerprint = null, { page = 1, limit = 20 } = {}) {
  await ensureSeedTestimonials();

  // Enforce limits
  const numericLimit = Math.min(Number(limit) || 20, 100);
  const numericPage = Math.max(Number(page) || 1, 1);
  const numericSkip = (numericPage - 1) * numericLimit;

  const testimonials = await testimonialDao.findApprovedTestimonialsPaginated({ limit: numericLimit, skip: numericSkip });
  const formatted = testimonials.map((item) =>
    formatTestimonial({
      ...item,
      isOwn: clientFingerprint && item.clientFingerprint === clientFingerprint,
    })
  );

  return {
    testimonials: formatted,
    stats: calculateStats(formatted),
    userReview: clientFingerprint
      ? formatted.find((item) => item.isOwn) || null
      : null,
  };
}

function assertNotBot(website) {
  if (website && String(website).trim().length > 0) {
    throw new AppError("Review submission rejected.", 400);
  }
}

async function assertIpNotSpamming(submitterIp) {
  if (!submitterIp) return;

  const since = new Date(Date.now() - IP_REVIEW_WINDOW_MS);
  const recentCount = await testimonialDao.countRecentByIp(submitterIp, since);

  if (recentCount >= MAX_REVIEWS_PER_IP_PER_DAY) {
    throw new AppError(
      "Too many reviews submitted from this network. Please try again later.",
      429
    );
  }
}

export async function submitTestimonial(payload, submitterIp) {
  const { name, rating, comment, commentHi, clientFingerprint, website } = payload;

  assertNotBot(website);
  await assertIpNotSpamming(submitterIp);

  const existing = await testimonialDao.findByFingerprint(clientFingerprint);
  if (existing && !existing.isSeed) {
    throw new AppError(
      "You have already submitted a review. Edit your existing review instead of creating a new one.",
      409
    );
  }

  if (submitterIp) {
    const since = new Date(Date.now() - IP_REVIEW_WINDOW_MS);
    const duplicateComment = await testimonialDao.findRecentDuplicateComment(
      submitterIp,
      comment,
      since
    );

    if (duplicateComment) {
      throw new AppError("This review looks like a duplicate submission.", 409);
    }
  }

  const created = await testimonialDao.createTestimonial({
    name: name.trim(),
    rating,
    comment: comment.trim(),
    commentHi: commentHi?.trim() || "",
    clientFingerprint,
    submitterIp,
    status: "approved",
    isSeed: false,
  });

  return formatTestimonial({ ...created.toObject(), isOwn: true });
}

export async function updateUserTestimonial(payload, submitterIp) {
  const { name, rating, comment, commentHi, clientFingerprint, website } = payload;

  assertNotBot(website);

  const existing = await testimonialDao.findByFingerprint(clientFingerprint);
  if (!existing || existing.isSeed) {
    throw new AppError("No review found to update for this device.", 404);
  }

  const updated = await testimonialDao.updateTestimonialByFingerprint(clientFingerprint, {
    name: name.trim(),
    rating,
    comment: comment.trim(),
    commentHi: commentHi?.trim() || "",
    submitterIp: submitterIp || existing.submitterIp,
  });

  if (!updated) {
    throw new AppError("No review found to update for this device.", 404);
  }

  return formatTestimonial({ ...updated, isOwn: true });
}

export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }

  return req.ip || null;
}
