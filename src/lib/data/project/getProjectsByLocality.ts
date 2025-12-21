// src/lib/data/project/getProjectsByLocality.ts

export function getProjectsByLocality(
  projects: any[],
  city: string,
  locality: string
) {
  const c = city.toLowerCase();
  const l = locality.toLowerCase();

  return projects.filter(
    (p) =>
      p.locationMeta?.city?.toLowerCase() === c &&
      p.locationMeta?.locality?.toLowerCase() === l
  );
}
