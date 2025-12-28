import { allProjectMetas } from "@/lib/data/loadProject";

/**
 * A city slug is valid if at least one project exists in that city
 */
export function isCitySlug(slug: string): boolean {
  return allProjectMetas.some(
    (p) => p.city?.toLowerCase() === slug
  );
}
