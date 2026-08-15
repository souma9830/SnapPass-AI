import { body, header, query } from "express-validator";

const testimonialFields = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Comment must be between 10 and 500 characters"),
  body("commentHi")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Hindi comment must be less than 500 characters"),
  body("clientFingerprint")
    .trim()
    .notEmpty()
    .withMessage("Client fingerprint is required")
    .isLength({ min: 16, max: 128 })
    .withMessage("Invalid client fingerprint"),
  body("website")
    .optional({ values: "falsy" })
    .custom((value) => !value || String(value).trim().length === 0)
    .withMessage("Invalid submission"),
];

export const submitTestimonialValidation = [...testimonialFields];

export const updateTestimonialValidation = [...testimonialFields];

export const getTestimonialsValidation = [
  query("fingerprint")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 16, max: 128 })
    .withMessage("Invalid client fingerprint"),
  header("x-client-fingerprint")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 16, max: 128 })
    .withMessage("Invalid client fingerprint"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer >= 1"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100"),
];
