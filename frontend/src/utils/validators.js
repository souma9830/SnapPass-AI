export const calculatePasswordStrength = (password) => {
  let score = 0;

  if (!password) {
    return {
      score: 0,
      label: '',
    };
  }

  const weakPatterns = [
    '123456',
    'password',
    'qwerty',
    'admin',
  ];

  if (
    weakPatterns.some((item) =>
      password.toLowerCase().includes(item)
    )
  ) {
    return {
      score: 0,
      label: 'Highly vulnerable. Add distinct characters.',
    };
  }

  if (password.length >= 8) score++;

  if (
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password)
  ) {
    score++;
  }

  if (/[0-9]/.test(password)) {
    score++;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }

  if (/(.)\1{3,}/.test(password)) {
    score = Math.max(score - 1, 0);
  }

  let label = '';

  switch (score) {
    case 0:
    case 1:
      label = 'Highly vulnerable. Add distinct characters.';
      break;

    case 2:
      label = 'Medium strength. Try adding symbols.';
      break;

    case 3:
      label = 'Strong password. Meets baseline safety.';
      break;

    case 4:
      label = 'Excellent! Cryptographically robust.';
      break;

    default:
      label = '';
  }

  return {
    score,
    label,
  };
};

export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export const sanitizeFileNameInput = (input) => {
  return input.replace(/[^a-zA-Z0-9_\-\.]/g, '');
};
