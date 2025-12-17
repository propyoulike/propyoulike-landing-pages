// src/lib/data/project/isProjectSlug.ts
import type { ProjectMeta } from "./buildProjectMeta";

export function isProjectSlug(
  allMetas: ProjectMeta[],
  slug: string
): boolean {
  if (!slug || !Array.isArray(allMetas)) return false;

  return allMetas.some((p) => p.slug === slug);
}
