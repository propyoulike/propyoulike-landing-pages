import { allProjectMetas } from "@/lib/data/loadProject";

/**
 * A builder slug is valid if at least one project belongs to it
 */
export function isBuilderSlug(slug: string): boolean {
  return allProjectMetas.some(
    (p) => p.builder === slug
  );
}
