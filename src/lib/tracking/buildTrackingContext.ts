/**
 * ============================================================
 * buildTrackingContext
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Builds the BASE analytics context for the current route
 * - Pure function (NO hooks, NO side effects)
 * - Router-aware inputs are passed IN
 *
 * SAFETY GUARANTEES
 * ------------------------------------------------------------
 * - NEVER throws
 * - Tolerates undefined / transitional router states
 * - Stable in DEV + PROD + prerender hydration
 * - Safe with or without __PROJECT__
 *
 * ============================================================
 */

type BuildTrackingContextInput = {
  pathname?: string; // ⚠️ tolerant by design
};

export function buildTrackingContext({
  pathname,
}: BuildTrackingContextInput): Record<string, any> {
  const safePath = typeof pathname === "string" ? pathname : "/";

  // Optional project payload (exists only on project pages)
  const project = (window as any).__PROJECT__?.project;

  return {
    /* --------------------------------------------------------
       Page identity (ALWAYS present)
    -------------------------------------------------------- */
    page_path: safePath,
    page_type: inferPageType(safePath),

    /* --------------------------------------------------------
       Project identity (OPTIONAL, SAFE)
    -------------------------------------------------------- */
    page_slug: project?.slug,
    builder_id: project?.builder,
    project_id: project?.slug, // replace if you later add numeric IDs

    /* --------------------------------------------------------
       System metadata (ALWAYS present)
    -------------------------------------------------------- */
    source: "web",
    platform: "propyoulike",
  };
}

/* ------------------------------------------------------------
   Helpers (PURE, GUARDED)
------------------------------------------------------------ */

function inferPageType(path?: string): string {
  if (!path || typeof path !== "string") {
    return "unknown";
  }

  if (path === "/") return "home";
  if (path.startsWith("/builder/")) return "builder";
  if (path.startsWith("/locality/")) return "locality";

  // "/slug" → project page
  if (path.split("/").filter(Boolean).length === 1) {
    return "project";
  }

  return "unknown";
}
