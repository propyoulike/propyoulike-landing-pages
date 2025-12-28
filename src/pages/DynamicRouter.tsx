// src/pages/DynamicRouter.tsx

/**
 * ============================================================
 * DynamicRouter (DEV Runtime Resolver)
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - DEV-only dynamic route resolver
 * - Determines WHICH page to render for a given slug
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * - MUST NOT partially render ProjectPage
 * - MUST respect ProjectPage contract strictly
 * - PROD does NOT use this path (ProjectEntry handles it)
 *
 * ============================================================
 */

import { useLocation } from "react-router-dom";

import ProjectPage from "@/pages/ProjectPage";
import CityPage from "@/pages/CityPage";
import ZonePage from "@/pages/ZonePage";
import LocalityPage from "@/pages/LocalityPage";
import BuilderPage from "@/pages/BuilderPage";
import NotFound from "@/pages/NotFound";

import { useProject } from "@/lib/data/useProject";
import { resolveSlugFromPath } from "@/lib/routing/resolveSlug";

import { isCitySlug } from "@/lib/routing/isCitySlug";
import { isZoneSlug } from "@/lib/routing/isZoneSlug";
import { isLocalitySlug } from "@/lib/routing/isLocalitySlug";
import { isBuilderSlug } from "@/lib/routing/isBuilderSlug";

import { runtimeLog } from "@/lib/log/runtimeLog";

export default function DynamicRouter() {
  const location = useLocation();
  const slug = resolveSlugFromPath(location.pathname);

  runtimeLog("DynamicRouter", "info", "Resolved slug", {
    slug,
    path: location.pathname,
  });

  if (!slug) {
    return <NotFound />;
  }

  /* ----------------------------------------------------------
     1️⃣ Project (DEV ONLY)
     ----------------------------------------------------------
     useProject MUST return:
     { project, payload }
  ---------------------------------------------------------- */
  const {
    project,
    payload,
    loading,
    error,
  } = useProject(slug);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        Resolving page…
      </div>
    );
  }

  if (project && payload) {
    runtimeLog("DynamicRouter", "info", "Rendering ProjectPage", {
      slug,
      projectName: project.projectName,
    });

    return (
      <ProjectPage
        project={project}
        payload={payload}
      />
    );
  }

  if (error) {
    runtimeLog(
      "DynamicRouter",
      "warn",
      "useProject failed, falling back to non-project routes",
      { slug, error }
    );
  }

  /* ----------------------------------------------------------
     2️⃣ Builder
  ---------------------------------------------------------- */
  if (isBuilderSlug(slug)) {
    return <BuilderPage builder={slug} />;
  }

  /* ----------------------------------------------------------
     3️⃣ Locality
  ---------------------------------------------------------- */
  if (isLocalitySlug(slug)) {
    return <LocalityPage locality={slug} />;
  }

  /* ----------------------------------------------------------
     4️⃣ City / Zone
  ---------------------------------------------------------- */
  if (slug.includes("/")) {
    const [city, zone] = slug.split("/");
    if (isCitySlug(city) && isZoneSlug(city, zone)) {
      return <ZonePage city={city} zone={zone} />;
    }
  }

  /* ----------------------------------------------------------
     5️⃣ City
  ---------------------------------------------------------- */
  if (isCitySlug(slug)) {
    return <CityPage city={slug} />;
  }

  /* ----------------------------------------------------------
     Fallback
  ---------------------------------------------------------- */
  return <NotFound />;
}
