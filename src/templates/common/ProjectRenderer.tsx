// src/templates/common/ProjectRenderer.tsx

import sectionsConfig from "@/content/global/sections.config";
import { COMPONENT_REGISTRY } from "@/content/registry/componentRegistry";
import { resolveSectionProps } from "@/utils/resolveSectionProps";
import { buildMenuFromSections } from "@/utils/buildMenuFromSections";

interface ProjectRendererProps {
  project: any;
  ctx: {
    openCTA?: () => void;
    autoMenu?: boolean;
  };
}

export default function ProjectRenderer({ project, ctx }: ProjectRendererProps) {
  /* -------------------------------------------------
     Defensive guard
  -------------------------------------------------- */
  const safeSections = Array.isArray(sectionsConfig)
    ? sectionsConfig
    : [];

  /* -------------------------------------------------
     Menu items (single source of truth)
  -------------------------------------------------- */
  const menuItems = buildMenuFromSections(safeSections);

  return (
    <>
      {safeSections.map((section) => {
        const Component = COMPONENT_REGISTRY[section.component];
        if (!Component) return null;

        const resolvedProps = resolveSectionProps(
          section.props,
          project,
          { ...ctx, menuItems },
          project.resolved,
          section.id
        );

        /**
         * 🔑 IMPORTANT:
         * Section wrapper is owned by the component itself.
         * Do NOT wrap again here.
         */
        return (
          <Component
            key={section.id}
            {...resolvedProps}
          />
        );
      })}
    </>
  );
}
