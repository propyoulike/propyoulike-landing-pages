// src/lib/data/loadProject.ts

/**
 * ============================================================
 * loadProject (DEV Runtime Loader)
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - DEV-only orchestration layer
 * - Delegates ALL real work to resolveProject
 *
 * GUARANTEES (HARD)
 * ------------------------------------------------------------
 * - Dev and Prod use the SAME resolver
 * - No conditional logic, no data mutation
 * - No schema branching
 * - No environment-specific behavior
 *
 * RESULT
 * ------------------------------------------------------------
 * ❌ Dev/Prod divergence is impossible
 * ✅ Single source of truth for project resolution
 * ============================================================
 */

import { buildAllProjectMetas } from "./project";
import { resolveProject } from "@/lib/project/resolveProject";
import { runtimeLog } from "@/lib/log/runtimeLog";

/* ------------------------------------------------------------
   Load ALL JSON files once (Vite eager glob)
   ------------------------------------------------------------
   - Mirrors prod prerender behavior
   - Deterministic, hash-safe
------------------------------------------------------------ */
const contentFiles = import.meta.glob("/src/content/**/*.json", {
  eager: true,
}) as Record<string, any>;

function getJSON(path: string) {
  const mod = contentFiles[path];
  return mod ? mod.default ?? mod : null;
}

/* ------------------------------------------------------------
   Build project meta index ONCE
------------------------------------------------------------ */
export const allProjectMetas =
  buildAllProjectMetas(contentFiles);

export function getAllProjectMetas() {
  return allProjectMetas;
}

/* ------------------------------------------------------------
   Slug guard (DEV convenience only)
------------------------------------------------------------ */
export function isProjectSlug(urlSlug: string) {
  return allProjectMetas.some((project) => {
    const fullSlug = `${project.builder}-${project.slug}`;
    return fullSlug === urlSlug;
  });
}

/* ------------------------------------------------------------
   MAIN DEV ENTRY
------------------------------------------------------------ */
export async function loadProject(slug: string) {
  if (!slug) {
    runtimeLog("loadProject", "fatal", "Missing slug");
    throw new Error("PROJECT_SLUG_MISSING");
  }

  if (!isProjectSlug(slug)) {
    runtimeLog("loadProject", "fatal", "Invalid project slug", {
      slug,
    });
    throw new Error("PROJECT_SLUG_INVALID");
  }

  runtimeLog("loadProject", "info", "Resolving project", {
    slug,
  });

  /**
   * 🔒 SINGLE SOURCE OF TRUTH
   * ----------------------------------------------------------
   * - Same resolver used by:
   *   • Dev runtime
   *   • Prod prerender
   *   • SEO generation
   *   • Static export
   *
   * - This call MUST NEVER be wrapped, mutated, or branched
   */
  const resolved = resolveProject({
    slug,
    getJSON,
    allProjectMetas,
  });

  runtimeLog("loadProject", "info", "Project resolved", {
    slug,
    faqCount: resolved.faq?.faqs?.length ?? 0,
  });

  return resolved;
}
