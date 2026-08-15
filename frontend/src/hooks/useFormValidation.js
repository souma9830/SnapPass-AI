import { useState, useCallback } from 'react';

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const URL_RE = /^https?:\/\/.+/;
const PHONE_RE = /^\+?[\d\s\-()]{7,15}$/;

const defaultRules = {
  required: (v) => (v !== null && v !== undefined && String(v).trim() !== '') || 'This field is required',
  email: (v) => !v || EMAIL_RE.test(v) || 'Invalid email address',
  minLength: (min) => (v) => !v || String(v).length >= min || `Minimum ${min} characters required`,
  maxLength: (max) => (v) => !v || String(v).length <= max || `Maximum ${max} characters allowed`,
  url: (v) => !v || URL_RE.test(v) || 'Invalid URL',
  phone: (v) => !v || PHONE_RE.test(v) || 'Invalid phone number',
  pattern: (re, msg) => (v) => !v || re.test(v) || msg || 'Invalid format',
  match: (field, label) => (v, values) => !v || v === values[field] || `Must match ${label || field}`,
  number: (v) => !v || !isNaN(Number(v)) || 'Must be a number',
  min: (min) => (v) => !v || Number(v) >= min || `Minimum value is ${min}`,
  max: (max) => (v) => !v || Number(v) <= max || `Maximum value is ${max}`,
};

export default function useFormValidation(fields, options = {}) {
  const [values, setValues] = useState(() => {
    const initial = {};
    Object.keys(fields).forEach((name) => {
      initial[name] = fields[name].initialValue ?? '';
    });
    return initial;
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = useCallback((name, value) => {
    const field = fields[name];
    if (!field) return '';
    const rules = field.rules || [];
    for (const rule of rules) {
      const result = rule(value, values);
      if (typeof result === 'string') return result;
      if (result === false) return field.errorMessage || 'Invalid value';
    }
    return '';
  }, [fields, values]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    let valid = true;
    Object.keys(fields).forEach((name) => {
      const err = validateField(name, values[name]);
      if (err) {
        newErrors[name] = err;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  }, [fields, values, validateField]);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (options.validateOnChange && touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  }, [fields, options.validateOnChange, touched, validateField]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === 'checkbox' ? checked : value);
  }, [setValue]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (options.validateOnBlur !== false) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  }, [options.validateOnBlur, validateField]);

  const handleSubmit = useCallback(async (onSubmit) => {
    return async (e) => {
      if (e) e.preventDefault();
      setSubmitting(true);
      const allTouched = {};
      Object.keys(fields).forEach((n) => { allTouched[n] = true; });
      setTouched(allTouched);
      if (!validateAll()) {
        setSubmitting(false);
        return;
      }
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    };
  }, [fields, validateAll, values]);

  const reset = useCallback(() => {
    const initial = {};
    Object.keys(fields).forEach((name) => {
      initial[name] = fields[name].initialValue ?? '';
    });
    setValues(initial);
    setErrors({});
    setTouched({});
  }, [fields]);

  return {
    values,
    errors,
    touched,
    submitting,
    setValue,
    handleChange,
    handleBlur,
    handleSubmit,
    validateAll,
    reset,
    setValues,
  };
}

export { defaultRules };
