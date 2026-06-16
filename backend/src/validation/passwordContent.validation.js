/**
 * Password Content Validation
 *
 * Validates password content to prevent malware distribution,
 * suspicious patterns, and security threats.
 */

const VALIDATION_RULES = {
  MAX_SIZE: 10 * 1024, // 10KB in bytes
  SUSPICIOUS_PATTERNS: {
    // Executable file patterns
    EXECUTABLES: /\.(exe|bat|cmd|sh|com|pif|scr|vbs|js|jar|zip|rar|7z)$/i,
    // URL patterns
    URLS: /^(https?:\/\/|ftp:\/\/|www\.)/i,
    // Script patterns
    SCRIPTS: /^(javascript:|vbscript:|data:)/i,
    // Path patterns
    PATHS: /^([a-zA-Z]:\\|\/)(.*\\|\/)?.*\./,
  },
  WARNING_PATTERNS: {
    // Looks like a URL
    URL_LIKE: /^(http|https|ftp|www)/i,
    // Looks like an IP address
    IP_ADDRESS: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  },
  BLOCKED_CONTENT: [
    'cmd.exe',
    'powershell.exe',
    'bash',
    'sh',
    'rm -rf',
  ],
};

class PasswordContentValidator {
  /**
   * Validate password content for security issues
   * @param {string} content - Password content to validate
   * @returns {object} - Validation result with status, errors, and warnings
   */
  static validate(content) {
    if (!content || typeof content !== 'string') {
      return {
        isValid: false,
        errors: ['Password content must be a non-empty string'],
        warnings: [],
      };
    }

    const errors = [];
    const warnings = [];

    // Check size limit
    if (Buffer.byteLength(content, 'utf8') > VALIDATION_RULES.MAX_SIZE) {
      errors.push('Password exceeds maximum size limit (10KB)');
    }

    // Check for suspicious patterns
    if (VALIDATION_RULES.SUSPICIOUS_PATTERNS.EXECUTABLES.test(content)) {
      errors.push('Password contains executable file pattern');
    }

    if (VALIDATION_RULES.SUSPICIOUS_PATTERNS.URLS.test(content)) {
      errors.push('Password appears to be a URL, not a credential');
    }

    if (VALIDATION_RULES.SUSPICIOUS_PATTERNS.SCRIPTS.test(content)) {
      errors.push('Password contains script or protocol handler');
    }

    if (VALIDATION_RULES.SUSPICIOUS_PATTERNS.PATHS.test(content)) {
      errors.push('Password appears to be a file system path');
    }

    // Check for blocked content
    for (const blocked of VALIDATION_RULES.BLOCKED_CONTENT) {
      if (content.toLowerCase().includes(blocked.toLowerCase())) {
        errors.push(`Password contains blocked pattern: ${blocked}`);
      }
    }

    // Check for warning patterns
    if (VALIDATION_RULES.WARNING_PATTERNS.URL_LIKE.test(content)) {
      warnings.push('This looks like a URL. Did you mean to share a password instead?');
    }

    if (VALIDATION_RULES.WARNING_PATTERNS.IP_ADDRESS.test(content)) {
      warnings.push('This looks like an IP address. Verify you\'re sharing the correct credential.');
    }

    // Check for homograph attacks (similar characters)
    if (this._detectHomographAttack(content)) {
      warnings.push('Potential homograph attack detected. Review before sharing.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      securityLevel: this._calculateSecurityLevel(content, errors, warnings),
    };
  }

  /**
   * Detect potential homograph attacks using similar characters
   * @param {string} content - Content to check
   * @returns {boolean} - True if potential homograph attack detected
   */
  static _detectHomographAttack(content) {
    // Homograph attack detection: similar looking characters
    const homographPairs = [
      ['0', 'O'], // zero and capital O
      ['1', 'l', 'I'], // one, lowercase L, capital I
      ['8', 'B'], // eight and capital B
    ];

    for (const pair of homographPairs) {
      const counts = pair.map(char => (content.match(new RegExp(char, 'g')) || []).length);
      if (counts.some(c => c > 0) && Math.max(...counts) > 1) {
        return true;
      }
    }

    return false;
  }

  /**
   * Calculate security level of password content
   * @param {string} content - Password content
   * @param {array} errors - Validation errors
   * @param {array} warnings - Validation warnings
   * @returns {string} - Security level: high, medium, low
   */
  static _calculateSecurityLevel(content, errors, warnings) {
    if (errors.length > 0) return 'low';
    if (warnings.length > 0) return 'medium';

    // Check password strength for regular credentials
    const hasUpperCase = /[A-Z]/.test(content);
    const hasLowerCase = /[a-z]/.test(content);
    const hasNumbers = /\d/.test(content);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(content);
    const isLengthGood = content.length >= 12;

    const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars, isLengthGood]
      .filter(Boolean).length;

    if (strengthScore >= 4) return 'high';
    if (strengthScore >= 2) return 'medium';
    return 'low';
  }

  /**
   * Get human-readable validation report
   * @param {object} validation - Validation result from validate()
   * @returns {string} - Human-readable report
   */
  static getReport(validation) {
    const parts = [];

    if (!validation.isValid) {
      parts.push('Validation Failed:');
      validation.errors.forEach(err => parts.push(`  ✗ ${err}`));
    }

    if (validation.warnings.length > 0) {
      parts.push('Warnings:');
      validation.warnings.forEach(warn => parts.push(`  ⚠ ${warn}`));
    }

    if (validation.isValid && validation.warnings.length === 0) {
      parts.push('✓ Password content is valid');
    }

    return parts.join('\n');
  }
}

module.exports = PasswordContentValidator;
