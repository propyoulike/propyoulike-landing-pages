// src/pages/ProjectPage.view.tsx

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

/* Global brand config */
import propyoulike from "@/content/global/propyoulike.json";
import { normalizeWhatsappNumber } from "@/utils/normalizeWhatsapp";

/* ------------------------------------------------------------
   Error Boundary
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
   Props
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
     Runtime guard
  ---------------------------------------------------------- */
  const hasRouter = assertRouterContext("ProjectPageView");

  if (!hasRouter) {
    return (
      <main className="p-10">
        <h1 className="text-xl font-bold">Application error</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Navigation system is not available.
        </p>
      </main>
    );
  }

  runtimeLog("ProjectPageView", "info", "Render start", {
    projectName: project?.projectName,
    builder: project?.builder,
    type: project?.type,
  });

  /* ----------------------------------------------------------
     Guards
  ---------------------------------------------------------- */
  if (
    !project ||
    typeof project.builder !== "string" ||
    typeof project.type !== "string"
  ) {
    return <main className="p-10">Invalid project data</main>;
  }

  if (!payload || typeof payload !== "object") {
    return <main className="p-10">Invalid project payload</main>;
  }

  /* ----------------------------------------------------------
     Template resolution
  ---------------------------------------------------------- */
  const Template = getTemplate(project.builder, project.type);

  if (!Template) {
    return <main className="p-10">No template available</main>;
  }

  /* ----------------------------------------------------------
     Derived data
  ---------------------------------------------------------- */
  const breadcrumbs = buildBreadcrumbs(project);

  const whatsappNumber = normalizeWhatsappNumber(
    propyoulike.contact?.whatsapp ||
      propyoulike.contact?.phone
  );

  /* ----------------------------------------------------------
     Render
  ---------------------------------------------------------- */
  return (
    <>
      {/* SEO + breadcrumbs never depend on runtime UI */}
      <ProjectSEO project={project} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Runtime-safe rendering zone */}
      <ProjectErrorBoundary>
        <LeadCTAProvider
          projectName={project.projectName}
          projectId={project.slug}
          whatsappNumber={whatsappNumber}
        >
          {/* Main project sections */}
          <Template project={project} payload={payload} />

          {/* ✅ MUST live inside CTA provider */}
          <FloatingQuickNav footerId="site-footer" />
        </LeadCTAProvider>
      </ProjectErrorBoundary>

      {/* Footer is OUTSIDE CTA lifecycle */}
      <Footer
        id="site-footer"
        project={project}
        builder={payload.aboutBuilder}
      />
    </>
  );
}
