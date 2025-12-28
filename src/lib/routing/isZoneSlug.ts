import { allProjectMetas } from "@/lib/data/loadProject";

/**
 * A zone is valid if at least one project matches city + zone
 */
export function isZoneSlug(city: string, zone: string): boolean {
  return allProjectMetas.some(
    (p) =>
      p.city?.toLowerCase() === city &&
      p.zone?.toLowerCase() === zone
  );
}
