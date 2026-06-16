/**
 * Password Content Validation Middleware
 *
 * Validates password content before sharing to prevent
 * malware distribution and security threats.
 */

const PasswordContentValidator = require('../validation/passwordContent.validation');

const validatePasswordContent = (req, res, next) => {
  const { password, content } = req.body;
  const passwordValue = password || content;

  if (!passwordValue) {
    return next();
  }

  const validation = PasswordContentValidator.validate(passwordValue);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Password validation failed',
      errors: validation.errors,
      warnings: validation.warnings,
      securityLevel: validation.securityLevel,
    });
  }

  if (validation.warnings.length > 0) {
    res.locals.passwordValidationWarnings = validation.warnings;
  }

  res.locals.passwordSecurityLevel = validation.securityLevel;
  next();
};

module.exports = validatePasswordContent;
