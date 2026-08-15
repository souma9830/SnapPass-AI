const MIN_PORT = 1024;
const MAX_PORT = 65535;

export function validatePort(port) {
  const parsed = parseInt(port, 10);
  if (isNaN(parsed) || parsed < MIN_PORT || parsed > MAX_PORT) {
    return null;
  }
  return parsed;
}

export function resolvePort(preferred, fallback = 5000) {
  const validated = validatePort(preferred);
  if (validated) return validated;
  const fallbackValidated = validatePort(fallback);
  return fallbackValidated || 5000;
}
