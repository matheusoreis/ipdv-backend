export function isValidName(name: string): boolean {
  if (!name) {
    return false;
  }

  const trimmed = name.trim().replace(/\s+/g, " ");

  const parts = trimmed.split(" ");
  if (parts.length < 2) {
    return false;
  }

  return parts.every((part) => part.length >= 2);
}
