export function normalizeEmail(input) {
  return typeof input === 'string' ? input.trim().toLowerCase() : '';
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(pw) {
  return typeof pw === 'string' && pw.length >= 6;
}
