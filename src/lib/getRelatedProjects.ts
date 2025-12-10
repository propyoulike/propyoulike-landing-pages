import { getAllProjects } from "@/content/getAllProjects";

export function getRelatedProjects(current) {
  const all = getAllProjects();

  const sameBuilder = all.filter(
    p => p.builder === current.builder && p.slug !== current.slug
  );

  const sameLocality = all.filter(
    p =>
      p.summary?.location?.city &&
      current.summary?.location?.city &&
      p.summary.location.city.toLowerCase() ===
        current.summary.location.city.toLowerCase() &&
      p.slug !== current.slug
  );

  return {
    builderProjects: sameBuilder,
    localityProjects: sameLocality,
  };
}
