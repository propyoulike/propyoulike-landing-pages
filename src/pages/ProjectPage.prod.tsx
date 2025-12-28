// src/pages/ProjectPage.prod.tsx

/**
 * ============================================================
 * ProjectPageProd (Production Runtime Boundary)
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Production-only boundary for rendering a Project page
 * - Receives a FULLY-NORMALIZED, FLAT project identity via props
 * - Delegates ALL rendering to ProjectPageView
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * ✅ NEVER throws during React render
 * ✅ NEVER mutates payload or identity
 * ✅ NEVER performs schema validation
 * ✅ NEVER reshapes data
 *
 * FAILURE MODEL (IMPORTANT)
 * ------------------------------------------------------------
 * - ALL fatal validation happens BEFORE routing
 *   (ProjectEntry / loadProject)
 * - This file is render-safe by design
 * - Any contract violation renders a fallback UI
 *
 * WHY THIS EXISTS
 * ------------------------------------------------------------
 * React render must be:
 * - Pure
 * - Deterministic
 * - Non-throwing
 *
 * Throwing inside render = white screen + lost diagnostics.
 * This file explicitly forbids that.
 *
 * ============================================================
 */

import ProjectPageView from "./ProjectPage.view";
import { runtimeLog } from "@/lib/log/runtimeLog";

/* ------------------------------------------------------------
   Minimal identity contract required downstream
------------------------------------------------------------ */
export type ProjectIdentity = {
  slug: string;
  builder: string;
  type: string;
  projectName?: string;
  status?: string;

  // Forward-compatible metadata (SEO, experiments, etc.)
  [key: string]: any;
};

interface Props {
  /**
   * Fully-normalized, FLAT project identity.
   *
   * ✅ { slug, builder, type, projectName, ... }
   * ❌ { project, hero, summary, ... }
   */
  project: ProjectIdentity;

  /**
   * Structured section payload.
   * Identity MUST NOT be present here.
   */
  payload: Record<string, any>;
}

/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */
export default function ProjectPageProd({
  project,
  payload,
}: Props) {
  /* ----------------------------------------------------------
     Lifecycle diagnostic (ONE log, intentional)
  ---------------------------------------------------------- */
  runtimeLog("ProjectPageProd", "info", "Entered", {
    projectName: project?.projectName,
    slug: project?.slug,
    builder: project?.builder,
    type: project?.type,
  });

  /* ----------------------------------------------------------
     RENDER-SAFE CONTRACT GUARD
     ----------------------------------------------------------
     ❌ NO throws
     ❌ NO schema parsing
     ❌ NO side effects
  ---------------------------------------------------------- */
  const isInvalid =
    !project ||
    typeof project.slug !== "string" ||
    typeof project.builder !== "string" ||
    typeof project.type !== "string" ||
    // Anti-regression: raw payload accidentally passed again
    (project as any).project;

  if (isInvalid) {
    runtimeLog(
      "ProjectPageProd",
      "error",
      "Contract violation (render-safe)",
      project
    );

    return (
      <main className="p-10 font-sans">
        <h1 className="text-xl font-bold">
          Project cannot be rendered
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The project data contract was violated.
          Please contact support.
        </p>
      </main>
    );
  }

  /* ----------------------------------------------------------
     Delegate to pure view layer
  ---------------------------------------------------------- */
  return (
    <ProjectPageView
      project={project}
      payload={payload}
    />
  );
}
