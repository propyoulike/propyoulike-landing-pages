// src/lib/data/project/getProjectsByZoneSlug.ts

interface ZoneResult {
  city: string;
  zone: string;
  projects: any[];
}

/**
 * Resolve zone projects from a zone slug like:
 *   bangalore-west
 */
export function getProjectsByZoneSlug(
  allProjects: any[],
  zoneSlug: string
): ZoneResult | null {
  if (!zoneSlug || typeof zoneSlug !== "string") return null;

  const normalizedSlug = zoneSlug.toLowerCase();

  const matchedProjects = allProjects.filter((project) => {
    if (!project.city || !project.zone) return false;

    const projectZoneSlug = `${project.city}-${project.zone}`
      .toLowerCase()
      .replace(/\s+/g, "-");

    return projectZoneSlug === normalizedSlug;
  });

  if (matchedProjects.length === 0) return null;

  return {
    city: matchedProjects[0].city,
    zone: matchedProjects[0].zone,
    projects: matchedProjects,
  };
}
