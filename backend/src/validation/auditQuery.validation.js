/**
 * auditQuery.validation.js — Query validation for audit log export endpoint.
 */

export const validateAuditExportQuery = (query) => {
  const errors = [];
  const validFormats = ['csv', 'ndjson', 'json'];

  if (query.format && !validFormats.includes(query.format.toLowerCase())) {
    errors.push(`Invalid format '${query.format}'. Allowed formats: ${validFormats.join(', ')}.`);
  }

  if (query.startDate && isNaN(Date.parse(query.startDate))) {
    errors.push('Invalid startDate format. Must be an ISO date string.');
  }

  if (query.endDate && isNaN(Date.parse(query.endDate))) {
    errors.push('Invalid endDate format. Must be an ISO date string.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
