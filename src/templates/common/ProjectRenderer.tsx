// src/templates/common/ProjectRenderer.tsx
import React, { Suspense, useMemo, useEffect } from "react";
import { SECTIONS } from "@/templates/common/sections.config";
import type { ProjectData } from "@/content/schema/project.schema";

import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import { buildAutoMenuFromResolved } from "@/templates/common/buildAutoMenu";

import FloatingQuickNav from "@/templates/common/FloatingQuickNav";

import { getRelatedProjects } from "@/lib/getRelatedProjects";
import { applyTheme } from "@/themes/applyTheme";
import { loadBuilder } from "@/lib/data/loadBuilder";
import { getBuilderOverrides } from "@/templates/common/builderOverrides";

import Footer from "@/components/footer/Footer";
import brand from "@/content/global/propyoulike.json";
import legal from "@/content/legal/legalIndex.json";

/* -------------------------------------------------------------
   Error Boundary for each section
------------------------------------------------------------- */
class SectionErrorBoundary extends React.Component<
  { sectionName: string; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="py-8 text-center text-red-600">
          Error loading section: {this.props.sectionName}
        </div>
      );
    }
    return this.props.children;
  }
}

/* -------------------------------------------------------------
   DOM ID Normalizer
------------------------------------------------------------- */
function sanitizeId(raw?: string | null): string {
  if (!raw) return "";
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "");
}

/* -------------------------------------------------------------
   MAIN RENDERER
------------------------------------------------------------- */
export default function ProjectRenderer({ project }: { project: ProjectData }) {
  const { openCTA } = useLeadCTAContext();

  /* ---------------------------------------------------------
     Load Builder Data + Apply Theme
  --------------------------------------------------------- */
  const builderData = useMemo(() => {
    if (!project.builder) return null;
    return loadBuilder(project.builder);
  }, [project.builder]);

  useEffect(() => {
    if (builderData?.theme) applyTheme(builderData.theme);
  }, [builderData]);

  /* ---------------------------------------------------------
     Project Sections
  --------------------------------------------------------- */
  const sections = useMemo(() => [...(project.sections || [])], [project.sections]);

  /* ---------------------------------------------------------
     Builder Overrides
  --------------------------------------------------------- */
  const finalSections = useMemo(() => {
    const overrides = getBuilderOverrides(project.builder) || {};
    const merged: Record<string, any> = {};

    for (const k of Object.keys(SECTIONS)) {
      merged[k] = { ...(SECTIONS as any)[k], ...(overrides as any)[k] };
    }
    return merged as typeof SECTIONS;
  }, [project.builder]);

  /* ---------------------------------------------------------
     Related Projects
  --------------------------------------------------------- */
  const related = useMemo(() => getRelatedProjects(project), [project]);

  /* ---------------------------------------------------------
     Build AutoMenu
  --------------------------------------------------------- */
  const resolvedSectionMap = useMemo(() => {
    return sections
      .map((name) => {
        const normalized =
          (name as string).charAt(0).toUpperCase() + (name as string).slice(1);

        const def = (finalSections as any)[normalized];
        if (!def || def.menuVisible === false) return null;

        const rawId = typeof def.id === "function" ? def.id(project) : def.id;

        const resolvedId = sanitizeId(rawId);
        if (!resolvedId) return null;

        const label =
          def.menuLabel ?? normalized.replace(/([A-Z])/g, " $1").trim();

        return { name: normalized, id: resolvedId, label };
      })
      .filter(Boolean) as { name: string; id: string; label: string }[];
  }, [sections, finalSections, project]);

  const autoMenu = useMemo(
    () => buildAutoMenuFromResolved(resolvedSectionMap, project),
    [resolvedSectionMap, project]
  );

  /* ---------------------------------------------------------
     CLEAN Scroll Restoration (Fixes auto-scroll bug)
  --------------------------------------------------------- */
  useEffect(() => {
    // Prevent initial unwanted scroll jump
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */
  return (
    <div>
      {sections.map((name) => {
        const normalized =
          (name as string).charAt(0).toUpperCase() + (name as string).slice(1);

        const def = (finalSections as any)[normalized];
        if (!def) return null;

        const Component = def.Component;
        const propsFactory = def.props;

        const props =
          (typeof propsFactory === "function"
            ? propsFactory(project, { openCTA, autoMenu, related })
            : def.props) || {};

        const extraProps =
          normalized === "Navbar" ? { autoMenu, onCtaClick: openCTA } : {};

        /* -----------------------------------------------------
           FIXED ID Logic — No more auto-generated numeric IDs
        ----------------------------------------------------- */
        let id = "";
        try {
          const raw = typeof def.id === "function" ? def.id(project) : def.id;

          id = sanitizeId(raw);
          if (!id) id = sanitizeId(name as string); // fallback to original section name
        } catch {
          id = sanitizeId(name as string);
        }

        return (
          <section key={id} id={id} className="scroll-mt-24">
            <SectionErrorBoundary sectionName={normalized}>
              <Suspense
                fallback={
                  <div className="py-10 text-center text-muted-foreground">
                    Loading {normalized}…
                  </div>
                }
              >
                <Component {...props} {...extraProps} />
              </Suspense>
            </SectionErrorBoundary>
          </section>
        );
      })}

      {/* Floating mini-nav */}
      <FloatingQuickNav items={autoMenu} />

      {/* Footer */}
      <Footer
        project={project}
        builder={builderData}
        brand={brand}
        legal={legal}
      />
    </div>
  );
}
