// src/templates/common/ProjectRenderer.tsx
import React, { Suspense } from "react";
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
   Helper Types
------------------------------------------------------------- */

type SectionDef = typeof SECTIONS[keyof typeof SECTIONS];

type SectionPropsFactory = (
  project: ProjectData,
  ctx: {
    openCTA: () => void;
    autoMenu: { name: string; id: string; label: string }[];
    related: ProjectData[];
  }
) => Record<string, any>;

/* -------------------------------------------------------------
   Error Boundary for individual sections
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
        <div className="py-8 px-4 text-center text-red-600">
          Something went wrong in this section.
        </div>
      );
    }
    return this.props.children;
  }
}

/* -------------------------------------------------------------
   Utility: Sanitize DOM id
------------------------------------------------------------- */
function sanitizeId(raw?: string | null) {
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
     1. Read list of sections from project.json
  --------------------------------------------------------- */
  const sections = React.useMemo(
    () => [...(project.sections || [])],
    [project.sections]
  );

  /* ---------------------------------------------------------
     2. Load Builder Data (from /content/projects/.../aboutbuilder.json)
  --------------------------------------------------------- */
  const builderData = React.useMemo(() => {
    if (!project.builder) return null;
    return loadBuilder(project.builder);
  }, [project.builder]);

  /* ---------------------------------------------------------
     3. Apply Builder Theme (if exists)
  --------------------------------------------------------- */
  React.useEffect(() => {
    if (builderData?.theme) applyTheme(builderData.theme);
  }, [builderData]);

  /* ---------------------------------------------------------
     4. Builder-specific section overrides
  --------------------------------------------------------- */
  const finalSections = React.useMemo(() => {
    const overrides = getBuilderOverrides(project.builder) || {};
    const merged: Record<string, any> = {};

    Object.keys(SECTIONS).forEach((k) => {
      merged[k] = { ...(SECTIONS as any)[k], ...(overrides as any)[k] };
    });

    Object.keys(overrides).forEach((k) => {
      if (!merged[k]) merged[k] = overrides[k];
    });

    return merged as typeof SECTIONS;
  }, [project.builder]);

  /* ---------------------------------------------------------
     5. Related Projects Widget
  --------------------------------------------------------- */
  const related = React.useMemo(
    () => getRelatedProjects(project),
    [project]
  );

  /* ---------------------------------------------------------
     6. Build Auto Navigation Menu
  --------------------------------------------------------- */
  const resolvedSectionMap = React.useMemo(() => {
    return sections
      .map((name) => {
        const normalized =
          (name as string).charAt(0).toUpperCase() +
          (name as string).slice(1);

        const def: SectionDef | undefined = (finalSections as any)[normalized];
        if (!def || def.menuVisible === false) return null;

        const rawId =
          typeof def.id === "function" ? def.id(project) : def.id;

        const resolvedId = sanitizeId(
          typeof rawId === "string" ? rawId : String(rawId ?? "")
        );

        if (!resolvedId) return null;

        const label =
          def.menuLabel ??
          normalized.replace(/([A-Z])/g, " $1").trim();

        return { name: normalized, id: resolvedId, label };
      })
      .filter(Boolean) as { name: string; id: string; label: string }[];
  }, [sections, finalSections, project]);

  const autoMenu = React.useMemo(
    () => buildAutoMenuFromResolved(resolvedSectionMap, project),
    [resolvedSectionMap, project]
  );

  /* ---------------------------------------------------------
     7. Render
  --------------------------------------------------------- */
  return (
    <div>
      {/* ------------------ DYNAMIC SECTIONS ------------------ */}
      {sections.map((name, index) => {
        const normalized =
          (name as string).charAt(0).toUpperCase() +
          (name as string).slice(1);

        const def: SectionDef | undefined = (finalSections as any)[normalized];

        if (!def) {
          if (import.meta.env.DEV) {
            return (
              <section
                key={`unknown-${name}-${index}`}
                className="p-6 bg-red-50 text-red-700 border border-red-200"
              >
                <strong>Unknown section:</strong> "{name}"
              </section>
            );
          }
          return null;
        }

        const Component = def.Component as React.ComponentType<any>;
        const propsFactory = def.props as SectionPropsFactory | undefined;

        const props =
          (propsFactory
            ? propsFactory(project, { openCTA, autoMenu, related })
            : def.props) || {};

        const extraProps =
          normalized === "Navbar"
            ? { autoMenu, onCtaClick: openCTA }
            : {};

        let id = "";
        try {
          const raw =
            typeof def.id === "function" ? def.id(project) : def.id;

          const base = sanitizeId(
            typeof raw === "string" ? raw : String(raw ?? "")
          );

          id = base ? `${base}-${index}` : `section-${index}`;
        } catch {
          id = `section-${index}`;
        }

        return (
          <section id={id} key={id}>
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

      {/* ------------------ GLOBAL FOOTER ------------------ */}
      <Footer
        project={project}
        builder={builderData}
        brand={brand}
        legal={legal}
      />
    </div>
  );
}
