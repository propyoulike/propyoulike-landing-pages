// src/lib/data/project/getRelatedProjects.ts
export function getRelatedProjects(
  all: any[],
  current: any,
  limit = 3
) {
  return all
    .filter(
      (p) =>
        p.slug !== current.slug &&
        (
          p.locationMeta?.city === current.locationMeta?.city ||
          p.builder === current.builder
        )
    )
    .slice(0, limit);
}
