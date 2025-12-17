import type { ProjectData } from "@/content/schema/project.schema";
import { loadProject } from "@/lib/data/loadProject";

/* -------------------------------------------------
   In-memory cache (per session)
-------------------------------------------------- */
const cache = new Map<string, ProjectData>();

/* -------------------------------------------------
   Known project slugs (source of truth for now)
   → Can be replaced later with FS scan / API
-------------------------------------------------- */
const PROJECT_SLUGS = [
  "provident-sunworth-city",
  "provident-botanico",
  "provident-capella",
  "provident-deansgate",
] as const;

/* -------------------------------------------------
   Load ALL projects (once)
-------------------------------------------------- */
export async function loadAllProjects(): Promise<ProjectData[]> {
  // Fast path
  if (cache.size > 0) {
    return Array.from(cache.values());
  }

  for (const slug of PROJECT_SLUGS) {
    try {
      const data = await loadProject(slug);
      if (data) {
        cache.set(slug, data);
      }
    } catch (err) {
      // ❌ Never break entire app because of one project
      console.error(`❌ Failed to load project: ${slug}`, err);
    }
  }

  return Array.from(cache.values());
}

/* -------------------------------------------------
   Get single project (lazy-safe)
-------------------------------------------------- */
export async function getProject(slug: string): Promise<ProjectData | undefined> {
  if (!cache.size) {
    await loadAllProjects();
  }

  return cache.get(slug);
}
