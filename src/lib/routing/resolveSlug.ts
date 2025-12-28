/**
 * Resolve a clean slug from a URL pathname
 *
 * Examples:
 *  "/"                          → null
 *  "/provident-sunworth-city/"  → "provident-sunworth-city"
 *  "/bangalore/whitefield/"     → "bangalore/whitefield"
 */
export function resolveSlugFromPath(pathname: string): string | null {
  if (!pathname || pathname === "/") return null;

  return pathname
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}
