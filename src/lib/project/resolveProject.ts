/**
 * ============================================================
 * resolveProject (SINGLE SOURCE OF TRUTH)
 * ============================================================
 *
 * PURPOSE
 * ------------------------------------------------------------
 * - Resolves a project into FINAL, RUNTIME-SAFE payload
 * - Used by BOTH:
 *   1. DEV runtime loader (loadProject.ts)
 *   2. PROD prerender (generate-prerender-pages.cjs)
 *
 * HARD GUARANTEES
 * ------------------------------------------------------------
 * - ❌ No React imports
 * - ❌ No browser APIs
 * - ❌ No environment branching
 * - ❌ No logging assumptions
 * - ✅ Pure, deterministic data function
 *
 * If this throws → BUILD MUST FAIL
 * ============================================================
 */

import { ProjectSchema } from "@/content/schema/project.schema";
import {
  loadBaseProject,
  hydrateFiles,
  mergeFaqs,
} from "@/lib/data/project";
import { getRelatedProjects } from "@/lib/data/project/getRelatedProjects";

interface ResolveProjectArgs {
  slug: string;
  getJSON: (path: string) => any;
  allProjectMetas: any[];
}

export function resolveProject({
  slug,
  getJSON,
  allProjectMetas,
}: ResolveProjectArgs) {
  if (!slug) {
    throw new Error("[resolveProject] Missing slug");
  }

  /* ------------------------------------------------------------
     BASE PROJECT (IDENTITY ONLY)
  ------------------------------------------------------------ */
  const { builder, projectSlug, base } =
    loadBaseProject(slug, getJSON);

  /* ------------------------------------------------------------
     HYDRATION (FILES, MEDIA, CONTENT)
  ------------------------------------------------------------ */
  const hydrated = hydrateFiles(
    structuredClone(base),
    builder,
    projectSlug,
    getJSON
  );

  /* ------------------------------------------------------------
     FAQ MERGE (GLOBAL → BUILDER → PROJECT)
  ------------------------------------------------------------ */
  hydrated.faq = mergeFaqs({
    builder,
    projectSlug,
    hydrated,
    getJSON,
  });

  /* ------------------------------------------------------------
     PROJECT IDENTITY VALIDATION (HARD FAIL)
  ------------------------------------------------------------ */
  const identityCheck = ProjectSchema.safeParse(
    hydrated.project
  );

  if (!identityCheck.success) {
    throw new Error(
      `[resolveProject] Project identity invalid for slug "${slug}": ` +
        identityCheck.error.issues
          .map((i) => i.path.join("."))
          .join(", ")
    );
  }

  /* ------------------------------------------------------------
     RELATED PROJECTS (DETERMINISTIC)
  ------------------------------------------------------------ */
  const related = getRelatedProjects(
    allProjectMetas,
    slug,
    {
      builderLimit: 4,
      localityLimit: 4,
    }
  );

  /* ------------------------------------------------------------
     FINAL PAYLOAD (PROD SHAPE)
  ------------------------------------------------------------ */
  return {
    ...hydrated, // hero, summary, faq, amenities, etc.
    builderProjects: related.builderProjects,
    localityProjects: related.localityProjects,
  };
}
