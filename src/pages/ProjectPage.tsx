/**
 * ============================================================
 * ProjectPage
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Environment switch between DEV and PROD project pages
 * - Passes an ALREADY-NORMALIZED project object downstream
 *
 * THIS COMPONENT IS ROUTER-SAFE
 * ------------------------------------------------------------
 * - NEVER throws during render
 * - NEVER navigates
 * - NEVER mutates router state
 *
 * All fatal validation MUST happen at ProjectEntry.
 *
 * OBSERVABILITY
 * ------------------------------------------------------------
 * - Boundary-level runtime logging only
 * - No console usage
 * - Soft-fail diagnostics for contract violations
 *
 * ============================================================
 */

import { IS_DEV } from "@/env/runtime";

import ProjectPageDev from "./ProjectPage.dev";
import ProjectPageProd from "./ProjectPage.prod";

import { runtimeLog } from "@/lib/log/runtimeLog";

/* ------------------------------------------------------------
   Props Contract
------------------------------------------------------------ */
type ProjectPageProps = {
  /**
   * Fully-normalized, FLAT project identity.
   * Guaranteed by ProjectEntry.
   */
  project: {
    slug: string;
    builder: string;
    builderName?: string;
    type: string;
    projectName?: string;
    status?: string;
  };

  /**
   * Structured section payload.
   * Identity MUST NOT be present here.
   */
  payload: Record<string, any>;
};

/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */
export default function ProjectPage({ project, payload }: ProjectPageProps) {
  /* ----------------------------------------------------------
     Runtime diagnostics (Boundary-level)
  ---------------------------------------------------------- */
  runtimeLog("ProjectPage", "info", "Entered ProjectPage", {
    env: IS_DEV ? "dev" : "prod",
    slug: project?.slug,
    builder: project?.builder,
    type: project?.type,
  });

  /* ----------------------------------------------------------
     SOFT GUARD #1 — identity integrity
     (render failure UI, NEVER throw)
  ---------------------------------------------------------- */
  if (
    !project ||
    typeof project.slug !== "string" ||
    typeof project.builder !== "string" ||
    typeof project.type !== "string"
  ) {
    runtimeLog("ProjectPage", "error", "Invalid project identity", project);

    return (
      <main className="p-10 font-sans">
        <h1 className="text-xl font-bold">Invalid project data</h1>
        <p>This project cannot be rendered.</p>
      </main>
    );
  }

  /* ----------------------------------------------------------
     SOFT GUARD #2 — payload leak detection
  ---------------------------------------------------------- */
  if ((project as any).project) {
    runtimeLog(
      "ProjectPage",
      "fatal",
      "Received full payload instead of flat project",
      project
    );

    return (
      <main className="p-10 font-sans">
        <h1 className="text-xl font-bold">Project payload error</h1>
        <p>Internal data contract violation.</p>
      </main>
    );
  }

  /* ----------------------------------------------------------
     Environment Switch (PURE)
  ---------------------------------------------------------- */
  runtimeLog("ProjectPage", "info", "Selecting environment renderer", {
    renderer: IS_DEV ? "ProjectPageDev" : "ProjectPageProd",
  });

  return IS_DEV ? (
    <ProjectPageDev project={project} payload={payload} />
  ) : (
    <ProjectPageProd project={project} payload={payload} />
  );
}
