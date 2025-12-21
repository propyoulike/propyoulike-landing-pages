// src/lib/data/project/getProjectsByZone.ts
export function getProjectsByZone(
  projects: any[],
  city: string,
  zone: string
) {
  const c = city.toLowerCase();
  const z = zone.toLowerCase();

  return projects.filter(
    (p) =>
      p.locationMeta?.city?.toLowerCase() === c &&
      p.locationMeta?.zone?.toLowerCase() === z
  );
}
