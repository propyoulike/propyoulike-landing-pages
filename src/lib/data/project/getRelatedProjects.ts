// src/lib/data/project/getRelatedProjects.ts

import type { ProjectMeta } from "./buildProjectMeta";

type RelatedProjectsResult = {
  builderProjects: ProjectMeta[];
  localityProjects: ProjectMeta[];
};

interface Options {
  builderLimit?: number;
  localityLimit?: number;
}

/* -------------------------------------------------
   Get related projects (builder + locality)
-------------------------------------------------- */
export function getRelatedProjects(
  allMetas: ProjectMeta[] = [],
  currentSlug: string,
  options: Options = {}
): RelatedProjectsResult {
  const {
    builderLimit = 4,
    localityLimit = 4,
  } = options;

  if (!Array.isArray(allMetas) || !currentSlug) {
    return { builderProjects: [], localityProjects: [] };
  }

  const current = allMetas.find((p) => p.slug === currentSlug);
  if (!current) {
    return { builderProjects: [], localityProjects: [] };
  }

  /* -------------------------------------------
     Builder projects (brand trust)
  -------------------------------------------- */
  const builderProjects = allMetas
    .filter(
      (p) =>
        p.builder === current.builder &&
        p.slug !== currentSlug
    )
    .sort((a, b) =>
      (a.projectName || "").localeCompare(b.projectName || "")
    )
    .slice(0, builderLimit);

  /* -------------------------------------------
     Locality projects (area alternatives)
  -------------------------------------------- */
  const localityProjects = allMetas
    .filter((p) => {
      if (p.slug === currentSlug) return false;
      if (!current.city || p.city !== current.city) return false;

      // Prefer same zone, but allow fallback
      if (current.zone && p.zone) {
        return p.zone === current.zone;
      }

      return true;
    })
    // Prefer projects with visuals
    .sort((a, b) =>
      Number(!!b.heroImage) - Number(!!a.heroImage)
    )
    .slice(0, localityLimit);

  return {
    builderProjects,
    localityProjects,
  };
}
