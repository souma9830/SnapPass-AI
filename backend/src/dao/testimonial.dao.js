import Testimonial from "../models/testimonial.model.js";

export async function countTestimonials() {
  return Testimonial.countDocuments();
}

export async function insertSeedTestimonials(seedDocs) {
  return Testimonial.insertMany(seedDocs, { ordered: false });
}

export async function findApprovedTestimonials() {
  // Default fetch all approved testimonials, sorted newest first
  return Testimonial.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .select("-submitterIp -__v")
    .lean();
}

// New paginated fetch for approved testimonials
export async function findApprovedTestimonialsPaginated({ limit, skip }) {
  // Ensure limit and skip are numbers
  const numericLimit = Number(limit) || 20;
  const numericSkip = Number(skip) || 0;
  return Testimonial.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .skip(numericSkip)
    .limit(numericLimit)
    .select("-submitterIp -__v")
    .lean();
}

export async function findByFingerprint(clientFingerprint) {
  return Testimonial.findOne({ clientFingerprint }).lean();
}

export async function countRecentByIp(submitterIp, since) {
  return Testimonial.countDocuments({
    submitterIp,
    createdAt: { $gte: since },
    isSeed: { $ne: true },
  });
}

export async function createTestimonial(payload) {
  return Testimonial.create(payload);
}

export async function updateTestimonialByFingerprint(clientFingerprint, updates) {
  return Testimonial.findOneAndUpdate(
    { clientFingerprint, isSeed: { $ne: true } },
    updates,
    { returnDocument: "after", runValidators: true }
  )
    .select("-submitterIp -__v")
    .lean();
}

export async function findRecentDuplicateComment(submitterIp, comment, since) {
  return Testimonial.findOne({
    submitterIp,
    comment: comment.trim(),
    createdAt: { $gte: since },
    isSeed: { $ne: true },
  }).lean();
}
