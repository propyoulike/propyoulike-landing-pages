export function normalizeWhatsappNumber(input?: string): string {
  if (!input) return "";

  // supports:
  // +919379822010
  // https://wa.me/919379822010
  // 919379822010
  return input.replace(/[^\d]/g, "");
}
