export function normalizeSlug(input: string) {
  return input.toLowerCase().trim().replace(/\s+/g, "-");
}

export function getPublicSlug(builder: string, slug: string) {
  return `${normalizeSlug(builder)}-${normalizeSlug(slug)}`;
}
