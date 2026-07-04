export const calculatePasswordStrength = (password) => {
  let score = 0;

  if (!password) {
    return { score: 0, label: '' };
  }

  const weakPatterns = ['123456', 'password', 'qwerty', 'admin'];

  if (weakPatterns.some((item) => password.toLowerCase().includes(item))) {
    return { score: 0, label: 'Highly vulnerable. Add distinct characters.' };
  }

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (/(.)\1{3,}/.test(password)) score = Math.max(score - 1, 0);

  const labels = {
    0: 'Highly vulnerable. Add distinct characters.',
    1: 'Highly vulnerable. Add distinct characters.',
    2: 'Medium strength. Try adding symbols.',
    3: 'Strong password. Meets baseline safety.',
    4: 'Excellent! Cryptographically robust.',
  };

  return { score, label: labels[score] || '' };
};

export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export const sanitizeFileNameInput = (input) => {
  return input.replace(/[^a-zA-Z0-9_\-.]/g, '');
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined) return `${fieldName} is required`;
  if (typeof value === 'string' && !value.trim()) return `${fieldName} is required`;
  return '';
};

export const validateMinLength = (value, min, fieldName = 'This field') => {
  if (!value || value.length < min) return `${fieldName} must be at least ${min} characters`;
  return '';
};

export const validatePhone = (phone) => {
  const cleaned = String(phone).replace(/[\s\-\(\)]/g, '');
  const re = /^\+?[1-9]\d{6,14}$/;
  if (!re.test(cleaned)) return 'Enter a valid phone number (e.g. +1234567890)';
  return '';
};

export const validateUrl = (url) => {
  if (!url || !url.trim()) return '';
  try {
    new URL(url);
    return '';
  } catch {
    return 'Enter a valid URL (e.g. https://example.com)';
  }
};

export const createValidator = (rules) => {
  return (values) => {
    const errors = {};
    for (const [field, fieldRules] of Object.entries(rules)) {
      for (const rule of fieldRules) {
        const error = rule(values[field], values);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }
    return errors;
  };
};
