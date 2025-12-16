// src/templates/common/ProjectRenderer.tsx

import sectionsConfig from "@/content/global/sections.config.json";
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
  const menuItems = buildMenuFromSections(sectionsConfig.sections);

  return (
    <>
      {sectionsConfig.sections.map((section) => {
        const Component = COMPONENT_REGISTRY[section.component];
        if (!Component) return null;

        const resolvedProps = resolveSectionProps(
          section.props,
          project,
          { ...ctx, menuItems },
          section.id
        );

        return (
          <section id={section.id} key={section.id}>
            <Component {...resolvedProps} />
          </section>
        );
      })}
    </>
  );
}
