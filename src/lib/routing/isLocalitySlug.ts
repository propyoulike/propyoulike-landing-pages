import { allProjectMetas } from "@/lib/data/loadProject";

/**
 * A locality is valid if any project exists in that locality
 */
export function isLocalitySlug(slug: string): boolean {
  return allProjectMetas.some(
    (p) => p.locality?.toLowerCase() === slug
  );
}
