import Testimonial from "../models/testimonial.model.js";

export async function countTestimonials() {
  return Testimonial.countDocuments();
}

export async function insertSeedTestimonials(seedDocs) {
  return Testimonial.insertMany(seedDocs, { ordered: false });
}

export async function findApprovedTestimonials(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const query = { status: "approved" };
  const total = await Testimonial.countDocuments(query);
  const testimonials = await Testimonial.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-submitterIp -__v")
    .lean();
  return { testimonials, total };
}

export async function getTestimonialStats() {
  const result = await Testimonial.aggregate([
    { $match: { status: "approved" } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);
  if (result.length === 0) {
    return { averageRating: 0, count: 0 };
  }
  return {
    averageRating: Number(result[0].averageRating.toFixed(1)),
    count: result[0].count
  };
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
