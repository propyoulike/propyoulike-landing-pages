// src/templates/common/ProjectRenderer.tsx
import React, { Suspense } from "react";
import { SECTIONS, type SectionName } from "@/templates/common/sections.config";
import type { ProjectData } from "@/content/schema/project.schema";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import { buildAutoMenuFromResolved } from "@/templates/common/buildAutoMenu";
import FloatingQuickNav from "@/templates/common/FloatingQuickNav";
import { getRelatedProjects } from "@/lib/getRelatedProjects";
import { applyTheme } from "@/themes/applyTheme";
import { loadBuilder } from "@/lib/data/loadBuilder";
import { getBuilderOverrides } from "@/templates/common/builderOverrides";

/** Convenience types */
type SectionDef = typeof SECTIONS[keyof typeof SECTIONS];
type SectionPropsFactory = (
  project: ProjectData,
  ctx: {
    openCTA: () => void;
    autoMenu: { name: string; id: string; label: string }[];
    related: ProjectData[];
  }
) => Record<string, any>;

/** Minimal Error Boundary per section */
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
  componentDidCatch(error: any, info: any) {
    // Hook for Sentry/LogRocket/etc.
    // console.error(`[SectionErrorBoundary:${this.props.sectionName}]`, error, info);
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

/** sanitize to usable DOM id (keeps letters, numbers, dash, underscore) */
function sanitizeId(raw?: string | null) {
  if (!raw) return "";
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_:]/g, ""); // keep safe chars
}

export default function ProjectRenderer({ project }: { project: ProjectData }) {
  const { openCTA } = useLeadCTAContext();

  // build sections (base from project JSON + widgets)
  const sections = React.useMemo(
    () => [
      ...(project.sections || []),
      ...(project.builderProjects?.length ? ["BuilderWidget"] : []),
      ...(project.localityProjects?.length ? ["LocalityWidget"] : []),
    ],
    [project.sections, project.builderProjects, project.localityProjects]
  );

  // Apply dynamic theme from aboutbuilder.json (unchanged)
  React.useEffect(() => {
    if (!project.builder) return;
    const builderData = loadBuilder(project.builder);
    if (builderData?.theme) applyTheme(builderData.theme);
  }, [project.builder]);

  // ------------------------------
  // Merge SECTIONS with builder overrides
  // ------------------------------
  const finalSections = React.useMemo(() => {
    const builder = project.builder;
    const overrides = getBuilderOverrides(builder); // {} if none
    // shallow-merge per-key so override can replace or augment properties
    const merged: Record<string, any> = {};
    Object.keys(SECTIONS).forEach((k) => {
      merged[k] = { ...(SECTIONS as any)[k], ...(overrides as any)[k] || {} };
    });
    // also include any override keys that didn't exist in SECTIONS (edge-case)
    Object.keys(overrides || {}).forEach((k) => {
      if (!merged[k]) merged[k] = (overrides as any)[k];
    });
    return merged as typeof SECTIONS;
  }, [project.builder]);

  // ------------------------------
  // Precompute related projects once
  // ------------------------------
  const related = React.useMemo(() => getRelatedProjects(project), [project]);

  // ------------------------------
  // 1) Build resolved section map (for auto-menu) — memoized
  // ------------------------------
  const resolvedSectionMap = React.useMemo(() => {
    return sections
      .map((name) => {
        const normalized = (name as string).charAt(0).toUpperCase() + (name as string).slice(1);
        const def: SectionDef | undefined = (finalSections as any)[normalized];
        if (!def || def.menuVisible === false) return null;

        const rawId = typeof def.id === "function" ? def.id(project) : def.id;
        const resolvedId = sanitizeId(typeof rawId === "string" ? rawId : String(rawId ?? ""));

        if (!resolvedId) return null;

        const label = def.menuLabel ?? normalized.replace(/([A-Z])/g, " $1").trim();

        return { name: normalized, id: resolvedId, label };
      })
      .filter(Boolean) as { name: string; id: string; label: string }[];
  }, [sections, finalSections, project]);

  // ------------------------------
  // 2) Build auto menu
  // ------------------------------
  const autoMenu = React.useMemo(() => buildAutoMenuFromResolved(resolvedSectionMap, project), [
    resolvedSectionMap,
    project,
  ]);

  // ------------------------------
  // 3) Render sections
  // ------------------------------
  return (
    <div>
      {sections.map((name, index) => {
        const normalized = (name as string).charAt(0).toUpperCase() + (name as string).slice(1);
        const def: SectionDef | undefined = (finalSections as any)[normalized];

        if (!def) {
          // visible dev-time hint rather than silent ignore
          if (import.meta.env.DEV) {
            return (
              <section key={`unknown-${index}`} className="p-6 bg-red-50 text-red-700 border border-red-100">
                <strong>Unknown section:</strong> "{name}"
              </section>
            );
          }
          console.warn(`⚠ Unknown section: "${name}"`);
          return null;
        }

        const Component = def.Component as React.ComponentType<any>;
        // unified props factory signature
        const propsFactory = def.props as SectionPropsFactory | undefined;
        const props = (propsFactory ? propsFactory(project, { openCTA, autoMenu, related }) : def.props) || {};

        // Navbar gets injected autoMenu + onCta to be safe (but builder override may change)
        const extraProps = normalized === "Navbar" ? { autoMenu, onCtaClick: openCTA } : {};

        // ensure stable, unique DOM id:
        // baseId from def.id (string or function) -> sanitized -> append index to avoid duplicates
        let id = "";
        try {
          const raw = typeof def.id === "function" ? def.id(project) : def.id;
          const base = sanitizeId(typeof raw === "string" ? raw : String(raw ?? ""));
          id = base ? `${base}-${index}` : `section-${index}`;
        } catch {
          id = `section-${index}`;
        }

        const key = `${id || normalized}-${index}`;

        return (
          <section id={id} key={key}>
            <SectionErrorBoundary sectionName={normalized}>
              <Suspense
                fallback={
                  <div className="py-10 text-center text-muted-foreground">
                    Loading {normalized}…
                  </div>
                }
              >
                {/* @ts-ignore */}
                <Component {...props} {...extraProps} />
              </Suspense>
            </SectionErrorBoundary>
          </section>
        );
      })}

      <FloatingQuickNav items={autoMenu} />
    </div>
  );
}
