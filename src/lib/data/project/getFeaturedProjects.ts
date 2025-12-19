// src/lib/data/project/getFeaturedProjects.ts
import { allProjectMetas } from "@/lib/data/loadProject";

export function getFeaturedProjects(limit = 3) {
  return allProjectMetas
    .filter(
      (p) =>
        p.featured === true &&
        p.slug &&
        p.projectName &&
        (p.city || p.locality)
    )
    .slice(0, limit);
}
