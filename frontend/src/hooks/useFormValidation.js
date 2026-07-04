import { useState, useCallback, useMemo } from 'react';

export default function useFormValidation(validationRules, initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validator = useMemo(() => {
    return (vals) => {
      const errs = {};
      for (const [field, rules] of Object.entries(validationRules)) {
        for (const rule of rules) {
          const error = rule(vals[field], vals);
          if (error) {
            errs[field] = error;
            break;
          }
        }
      }
      return errs;
    };
  }, [validationRules]);

  const validateField = useCallback((name, value) => {
    const fieldRules = validationRules[name];
    if (!fieldRules) return '';
    for (const rule of fieldRules) {
      const error = rule(value, { ...values, [name]: value });
      if (error) return error;
    }
    return '';
  }, [validationRules, values]);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const error = validateField(name, value);
      return error ? { ...prev, [name]: error } : Object.fromEntries(
        Object.entries(prev).filter(([k]) => k !== name)
      );
    });
  }, [validateField]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => {
      const error = validateField(name, values[name]);
      return error ? { ...prev, [name]: error } : Object.fromEntries(
        Object.entries(prev).filter(([k]) => k !== name)
      );
    });
  }, [validateField, values]);

  const validate = useCallback(() => {
    const errs = validator(values);
    setErrors(errs);
    setSubmitted(true);

    const allTouched = {};
    for (const key of Object.keys(validationRules)) {
      allTouched[key] = true;
    }
    setTouched(allTouched);

    return Object.keys(errs).length === 0;
  }, [validator, values, validationRules]);

  const reset = useCallback((newValues) => {
    setValues(newValues || initialValues);
    setErrors({});
    setTouched({});
    setSubmitted(false);
  }, [initialValues]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
  const isDirty = useMemo(() => Object.keys(touched).length > 0, [touched]);

  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] ?? '',
    onChange: (e) => {
      const val = e.target ? e.target.value : e;
      setFieldValue(name, val);
    },
    onBlur: () => handleBlur(name),
    error: touched[name] || submitted ? (errors[name] || '') : '',
  }), [values, setFieldValue, handleBlur, errors, touched, submitted]);

  return {
    values,
    errors,
    touched,
    submitted,
    setValue,
    setFieldValue,
    handleBlur,
    validate,
    reset,
    isValid,
    isDirty,
    getFieldProps,
  };
}
