import type { ProjectMeta } from "./buildProjectMeta";

export function getProjectsByCity(
  allMetas: ProjectMeta[] = [],
  city?: string
): ProjectMeta[] {
  if (!city || !allMetas.length) return [];

  const normalizedCity = city.trim().toLowerCase();

  return allMetas.filter(
    (p) => p.city?.toLowerCase() === normalizedCity
  );
}
