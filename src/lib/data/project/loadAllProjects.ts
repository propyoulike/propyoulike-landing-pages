import type { ProjectData } from "@/content/schema/project.schema";
import { loadProject, getAllProjectMetas } from "@/lib/data/loadProject";
import { runtimeLog } from "@/lib/log/runtimeLog";

/* -------------------------------------------------
   In-memory cache (per session)
-------------------------------------------------- */
const cache = new Map<string, ProjectData>();

/* -------------------------------------------------
   Derive project slugs from the SINGLE source of truth
-------------------------------------------------- */
function getAllProjectSlugs(): string[] {
  return getAllProjectMetas().map(
    (meta) => meta.publicSlug
  );
}

/* -------------------------------------------------
   Load ALL projects (once, fail-soft)
-------------------------------------------------- */
export async function loadAllProjects(): Promise<ProjectData[]> {
  /* ---------------- Cache hit ---------------- */
  if (cache.size > 0) {
    runtimeLog("loadAllProjects", "debug", "Cache hit", {
      count: cache.size,
    });
    return Array.from(cache.values());
  }

  const slugs = getAllProjectSlugs();

  runtimeLog("loadAllProjects", "info", "Bulk project load started", {
    projectCount: slugs.length,
  });

  let successCount = 0;
  let failureCount = 0;

  for (const slug of slugs) {
    try {
      const data = await loadProject(slug);

      if (data) {
        cache.set(slug, data);
        successCount++;
      }
    } catch (err) {
      failureCount++;

      runtimeLog("loadAllProjects", "error", "Failed to load project", {
        slug,
        error:
          err instanceof Error ? err.message : "PROJECT_LOAD_FAILED",
      });

      // ❗ Fail-soft: never break the loop
    }
  }

  runtimeLog("loadAllProjects", "info", "Bulk project load completed", {
    successCount,
    failureCount,
    cached: cache.size,
  });

  return Array.from(cache.values());
}

/* -------------------------------------------------
   Get single project (lazy-safe)
-------------------------------------------------- */
export async function getProject(
  slug: string
): Promise<ProjectData | undefined> {
  if (!cache.size) {
    runtimeLog("getProject", "debug", "Cache empty, triggering bulk load", {
      slug,
    });
    await loadAllProjects();
  }

  const project = cache.get(slug);

  if (!project) {
    runtimeLog("getProject", "warn", "Project not found in cache", { slug });
  }

  return project;
}
