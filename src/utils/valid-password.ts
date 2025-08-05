export function isValidPassword(password: string): boolean {
  return /^(?=.*[A-Z])(?=.*\d).{5,}$/.test(password);
}
