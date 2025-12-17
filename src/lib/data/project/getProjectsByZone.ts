import type { ProjectMeta } from "./buildProjectMeta";

export function getProjectsByZone(
  allMetas: ProjectMeta[] = [],
  city?: string,
  zone?: string
): ProjectMeta[] {
  if (!city || !zone || !allMetas.length) return [];

  const normalizedCity = city.trim().toLowerCase();
  const normalizedZone = zone.trim().toLowerCase();

  return allMetas.filter(
    (p) =>
      p.city?.toLowerCase() === normalizedCity &&
      p.zone?.toLowerCase() === normalizedZone
  );
}
