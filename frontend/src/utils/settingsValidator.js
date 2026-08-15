// Settings validation rules and input boundaries
export const validateSettingsInput = (values) => {
  const errors = {};
  if (!values.fullName || values.fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters';
  }
  if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Please enter a valid email address';
  }
  return errors;
};
