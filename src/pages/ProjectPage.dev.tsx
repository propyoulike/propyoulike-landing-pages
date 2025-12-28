// src/pages/ProjectPage.dev.tsx

/**
 * ============================================================
 * ProjectPageDev (Development Runtime Boundary)
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - DEV-only entry for rendering a Project page
 * - Resolves project data using client-side hooks
 * - MUST mirror production runtime contract exactly
 *
 * ============================================================
 */

import ProjectPageView from "./ProjectPage.view";
import { useProject } from "@/lib/data/useProject";
import { resolveSlugFromPath } from "@/lib/routing/resolveSlug";
import { runtimeLog } from "@/lib/log/runtimeLog";

export default function ProjectPageDev() {
  /* ----------------------------------------------------------
     Resolve slug from URL (DEV only)
  ---------------------------------------------------------- */
  const slug = resolveSlugFromPath(window.location.pathname);

  runtimeLog("ProjectPageDev", "info", "Resolved slug", {
    slug,
    path: window.location.pathname,
  });

  /* ----------------------------------------------------------
     Load FULL project payload
  ---------------------------------------------------------- */
  const { project, payload, loading, error } = useProject(slug);

  runtimeLog("ProjectPageDev", "debug", "useProject state", {
    loading,
    hasProject: Boolean(project),
    payloadKeys: payload ? Object.keys(payload) : [],
    error,
  });

  /* ----------------------------------------------------------
     DEV guards (allowed to throw)
  ---------------------------------------------------------- */
  if (loading) {
    return <div>Loading project…</div>;
  }

  if (error) {
    runtimeLog("ProjectPageDev", "fatal", "useProject error", error);
    throw new Error("DEV_USEPROJECT_FAILED");
  }

  if (!project) {
    runtimeLog("ProjectPageDev", "fatal", "Missing flat project identity");
    throw new Error("DEV_PROJECT_IDENTITY_MISSING");
  }

  if (!payload) {
    runtimeLog("ProjectPageDev", "fatal", "Missing project payload");
    throw new Error("DEV_PROJECT_PAYLOAD_MISSING");
  }

  /* ----------------------------------------------------------
     DEV parity assertion (CRITICAL)
  ---------------------------------------------------------- */
  const identityKeys = ["slug", "builder", "type"];
  const leakedKeys = identityKeys.filter((k) => k in payload);

  if (leakedKeys.length > 0) {
    runtimeLog(
      "ProjectPageDev",
      "fatal",
      "Payload contains identity fields (DEV parity violation)",
      { leakedKeys, payload }
    );

    throw new Error(
      `DEV_PAYLOAD_IDENTITY_LEAK: ${leakedKeys.join(", ")}`
    );
  }

  /* ----------------------------------------------------------
     Delegate to runtime view (PROD-PARITY)
  ---------------------------------------------------------- */
  return <ProjectPageView project={project} payload={payload} />;
}
