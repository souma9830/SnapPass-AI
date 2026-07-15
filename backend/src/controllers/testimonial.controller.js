import catchAsync from "../utils/catchAsync.js";
import * as testimonialService from "../service/testimonial.service.js";
import { successResponse } from "../utils/httpResponse.js";

export const getTestimonials = catchAsync(async (req, res) => {
  const clientFingerprint =
    req.query.fingerprint || req.headers["x-client-fingerprint"] || null;
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  const data = await testimonialService.getApprovedTestimonials(clientFingerprint, { page, limit });

  successResponse(res, data, "Testimonials fetched successfully");
});

export const submitTestimonial = catchAsync(async (req, res) => {
  const submitterIp = testimonialService.getClientIp(req);
  const testimonial = await testimonialService.submitTestimonial(
    req.body,
    submitterIp
  );

  successResponse(res, { testimonial }, "Review submitted successfully", 201);
});

export const updateTestimonial = catchAsync(async (req, res) => {
  const submitterIp = testimonialService.getClientIp(req);
  const testimonial = await testimonialService.updateUserTestimonial(
    req.body,
    submitterIp
  );

  successResponse(res, { testimonial }, "Review updated successfully");
});
