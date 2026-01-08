import { useEffect, useRef } from "react";

import sectionsConfig from "@/content/global/sections.config";
import { COMPONENT_REGISTRY } from "@/content/registry/componentRegistry";
import { resolveSectionProps } from "@/utils/resolveSectionProps";
import { buildMenuFromSections } from "@/utils/buildMenuFromSections";
import { normalizeComponent } from "@/lib/runtime/normalizeComponent";
import { runtimeLog } from "@/lib/log/runtimeLog";
import { forbidGlobals } from "@/lib/runtime/forbidGlobals";

import type { BuilderId } from "@/lib/analytics/builderIds";

/* ------------------------------------------------------------
   Types
------------------------------------------------------------ */

export interface ProjectAnalyticsContext {
  project_id: string;
  builder_id: BuilderId;
  project_name?: string;
}

export interface ProjectRendererContext {
  /* 🔑 REQUIRED — analytics identity */
  analytics: ProjectAnalyticsContext;

  /* Optional cross-cutting behavior */
  openCTA?: () => void;
  autoMenu?: boolean;

  /* Derived (injected here) */
  menuItems?: Array<{
    id: string;
    label: string;
  }>;
}

interface ProjectRendererProps {
  project: Record<string, any>;
  payload: Record<string, any>;
  ctx: ProjectRendererContext;
}

/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */

export default function ProjectRenderer({
  project,
  payload,
  ctx,
}: ProjectRendererProps) {
  /* ----------------------------------------------------------
     DEV-ONLY ARCHITECTURAL GUARD
  ---------------------------------------------------------- */
  if (import.meta.env.DEV) {
    forbidGlobals(["project", "builder", "slug"]);
  }

  /* ----------------------------------------------------------
     Guards (fail-soft, boundary-safe)
  ---------------------------------------------------------- */

  if (!ctx?.analytics) {
    runtimeLog(
      "ProjectRenderer",
      "fatal",
      "Missing analytics context",
      ctx
    );
    return null;
  }

  if (!Array.isArray(sectionsConfig)) {
    runtimeLog(
      "ProjectRenderer",
      "fatal",
      "sections.config is not an array",
      sectionsConfig
    );
    return null;
  }

  if (!project || typeof project !== "object") {
    runtimeLog("ProjectRenderer", "fatal", "Invalid project object", project);
    return null;
  }

  if (!payload || typeof payload !== "object") {
    runtimeLog("ProjectRenderer", "fatal", "Invalid payload object", payload);
    return null;
  }

  /* ----------------------------------------------------------
     🔑 MUST-HAVE: PAGE VIEW (ONCE)
     This is the canonical DLV source for GTM
  ---------------------------------------------------------- */
  const pageViewFiredRef = useRef(false);

  useEffect(() => {
    if (pageViewFiredRef.current) return;
    pageViewFiredRef.current = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",

      page_type: "project",
      page_slug: window.location.pathname.replace(/^\/|\/$/g, ""),

      project_id: ctx.analytics.project_id,
      project_name: ctx.analytics.project_name || undefined,
      builder_id: ctx.analytics.builder_id,
    });
  }, [ctx.analytics]);

  /* ----------------------------------------------------------
     Menu generation (pure)
  ---------------------------------------------------------- */
  const menuItems = buildMenuFromSections(sectionsConfig);

  /* ----------------------------------------------------------
     Structural observability (ONCE per render)
  ---------------------------------------------------------- */
  runtimeLog("ProjectRenderer", "debug", "Render plan", {
    sectionCount: sectionsConfig.length,
    sectionIds: sectionsConfig.map((s) => s.id),
    autoMenu: ctx.autoMenu,
    hasCTA: Boolean(ctx.openCTA),
    analytics: ctx.analytics,
  });

  /* ----------------------------------------------------------
     Render sections
  ---------------------------------------------------------- */
  return (
    <>
      {sectionsConfig.map((section) => {
        const entry = COMPONENT_REGISTRY[section.component];

        const Component = normalizeComponent(
          entry,
          section.component
        );

        if (!Component) {
          runtimeLog(
            "ProjectRenderer",
            "warn",
            "Skipping section due to invalid component",
            {
              sectionId: section.id,
              component: section.component,
            }
          );
          return null;
        }

        const resolvedProps = resolveSectionProps(
          section.props,
          project,
          {
            ...ctx,
            menuItems, // injected here, not upstream
          },
          payload,
          section.id
        );

        return <Component key={section.id} {...resolvedProps} />;
      })}
    </>
  );
}
