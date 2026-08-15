/**
 * webhookPayload.validation.js — Validator for webhook payload registration.
 */

export const validateWebhookEndpoint = (body) => {
  const errors = [];
  if (!body.targetUrl || !body.targetUrl.startsWith('http')) {
    errors.push('targetUrl must be a valid HTTP or HTTPS URL.');
  }

  if (!body.secret || body.secret.length < 8) {
    errors.push('secret must be at least 8 characters long.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
