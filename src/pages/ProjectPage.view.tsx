// src/pages/ProjectPage.view.tsx

/**
 * ============================================================
 * ProjectPageView
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Pure runtime renderer for a single Project page
 * - Resolves the correct visual template using:
 *     - project.builder
 *     - project.type
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * ✅ PURE RENDER (no data fetching, no normalization)
 * ✅ NO schema parsing
 * ✅ NO throws during render
 * ✅ Deterministic output for given props
 *
 * FAILURE MODEL
 * ------------------------------------------------------------
 * - Contract violations render fallback UI (never crash)
 * - Template / section failures are isolated via ErrorBoundary
 * - Missing runtime providers fail fast with diagnostics
 *
 * OBSERVABILITY
 * ------------------------------------------------------------
 * - Centralized logging via runtimeLog
 * - Runtime environment probes at page boundary
 * - No ad-hoc console logs
 *
 * ============================================================
 */

import React from "react";

import { getTemplate } from "@/templates/getTemplate";
import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";

import Footer from "@/components/footer/Footer";
import ProjectSEO from "@/components/seo/ProjectSEO";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import FloatingQuickNav from "@/templates/common/FloatingQuickNav";

import type { ProjectData } from "@/content/schema/project.schema";
import { runtimeLog } from "@/lib/log/runtimeLog";
import { assertRouterContext } from "@/lib/runtime/assertRouterContext";
import { buildBreadcrumbs } from "@/utils/buildBreadcrumbs";

/* ------------------------------------------------------------
   Local Error Boundary (NO external deps)
------------------------------------------------------------ */
class ProjectErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    runtimeLog("Render", "fatal", "Uncaught render error", {
      message: error.message,
      stack: error.stack,
      category: error.message.includes("useContext")
        ? "Missing runtime provider"
        : "Unknown render error",
    });

    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    runtimeLog("Render", "fatal", "Component stack", info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="p-10 font-sans">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A section of this project failed to render.
          </p>
        </main>
      );
    }

    return this.props.children;
  }
}

/* ------------------------------------------------------------
   Props Contract (LOCKED)
------------------------------------------------------------ */
interface ProjectPageViewProps {
  project: ProjectData;
  payload: Record<string, any>;
}

/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */
export default function ProjectPageView({
  project,
  payload,
}: ProjectPageViewProps) {
  /* ----------------------------------------------------------
     Runtime environment probes (Layer 0)
     MUST run before rendering Router-dependent components
  ---------------------------------------------------------- */
  const hasRouter = assertRouterContext("ProjectPageView");

  if (!hasRouter) {
    return (
      <main className="p-10">
        <h1 className="text-xl font-bold">Application error</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Navigation system is not available. Please refresh or try again later.
        </p>
      </main>
    );
  }

  /* ----------------------------------------------------------
     Structured diagnostics (Layer 1)
  ---------------------------------------------------------- */
  runtimeLog("ProjectPageView", "info", "Render start", {
    projectName: project?.projectName,
    builder: project?.builder,
    type: project?.type,
  });

  /* ----------------------------------------------------------
     RENDER-SAFE CONTRACT GUARDS
  ---------------------------------------------------------- */
  if (
    !project ||
    typeof project.builder !== "string" ||
    typeof project.type !== "string"
  ) {
    runtimeLog("ProjectPageView", "error", "Invalid project identity", project);
    return (
      <main className="p-10">
        <h1 className="text-xl font-bold">Invalid project data</h1>
      </main>
    );
  }

  if (!payload || typeof payload !== "object") {
    runtimeLog("ProjectPageView", "error", "Invalid payload", payload);
    return (
      <main className="p-10">
        <h1 className="text-xl font-bold">Invalid project data</h1>
      </main>
    );
  }

  /* ----------------------------------------------------------
     TEMPLATE RESOLUTION (PURE)
  ---------------------------------------------------------- */
  const Template = getTemplate(project.builder, project.type);

  if (!Template) {
    runtimeLog("ProjectPageView", "error", "Template not found", {
      builder: project.builder,
      type: project.type,
    });

    return (
      <main className="p-10">
        <h1 className="text-xl font-bold">No template available</h1>
      </main>
    );
  }

  /* ----------------------------------------------------------
     DERIVED UI DATA (PURE)
  ---------------------------------------------------------- */
  const breadcrumbs = buildBreadcrumbs(project);

  /* ----------------------------------------------------------
     Happy Path Render (Error-Isolated)
  ---------------------------------------------------------- */
  return (
    <>
      {/* SEO must render before visual content */}
      <ProjectSEO project={project} />

      {/* Navigation (Router-safe now) */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Template + sections isolated from crashing the page */}
      <ProjectErrorBoundary>
        <LeadCTAProvider
          projectName={project.projectName}
          projectId={project.slug}
          whatsappNumber="919379822010"
          trackEvent
        >
          <Template project={project} payload={payload} />
        </LeadCTAProvider>
      </ProjectErrorBoundary>

      {/* Mobile navigation & footer */}
      <FloatingQuickNav footerId="site-footer" />
      <Footer id="site-footer" project={project} />
    </>
  );
}
