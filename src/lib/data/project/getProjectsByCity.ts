// src/lib/data/project/getProjectsByCity.ts
export function getProjectsByCity(projects: any[], city: string) {
  const c = city.toLowerCase();

  return projects.filter(
    (p) =>
      p.locationMeta?.city?.toLowerCase() === c
  );
}
