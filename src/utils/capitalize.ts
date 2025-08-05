export function capitalizeAll(text?: string | null): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
