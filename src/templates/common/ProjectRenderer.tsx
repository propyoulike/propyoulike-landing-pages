// src/templates/common/ProjectRenderer.tsx
import { SECTIONS } from "@/templates/common/sections.config";
import type { ProjectData } from "@/content/schema/project.schema";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import { buildAutoMenuFromResolved } from "@/templates/common/buildAutoMenu";
import FloatingQuickNav from "@/templates/common/FloatingQuickNav";

export default function ProjectRenderer({ project }: { project: ProjectData }) {
  const { openCTA } = useLeadCTAContext();
  const sections = project.sections || [];

  // -----------------------------------------
  // 1️⃣ Build resolved section map
  // -----------------------------------------
  const resolvedSectionMap = sections
    .map((name) => {
      const normalized = name.charAt(0).toUpperCase() + name.slice(1);
      const def = SECTIONS[normalized];

      if (!def || def.menuVisible === false) return null;

      const resolvedId =
        typeof def.id === "function" ? def.id(project) : def.id;

      if (!resolvedId) return null;

      return {
        name: normalized,   // ⭐ REQUIRED for buildAutoMenu
        id: String(resolvedId).trim(),
        label: def.menuLabel ??
          normalized.replace(/([A-Z])/g, " $1").trim(), // "FloorPlansSection" → "Floor Plans Section"
      };
    })
    .filter(Boolean);

  // 1️⃣ Build resolved section map
const resolvedSectionMap = sections
  .map(...)
  .filter(Boolean);

console.log("[Renderer] sections input:", sections);
console.log("[Renderer] resolvedSectionMap:", resolvedSectionMap);


  // -----------------------------------------
  // 2️⃣ Build auto menu
  // -----------------------------------------
  const autoMenu = buildAutoMenuFromResolved(
    resolvedSectionMap as any,
    project
  );

  // -----------------------------------------
  // 3️⃣ Render sections
  // -----------------------------------------
  return (
    <div>
      {sections.map((name, index) => {
        const normalized = name.charAt(0).toUpperCase() + name.slice(1);
        const def = SECTIONS[normalized as keyof typeof SECTIONS];

        if (!def) {
          console.warn(`⚠ Unknown section: "${name}"`);
          return null;
        }

        const Component = def.Component;
        const props = def.props(project, openCTA, autoMenu);

        // inject autoMenu only into Navbar
        const extraProps =
          normalized === "Navbar"
            ? { autoMenu, onCtaClick: openCTA }
            : {};

        // ensure valid DOM id
        let id = "";
        try {
          const raw = typeof def.id === "function" ? def.id(project) : def.id;
          id = typeof raw === "string" ? raw : `section-${index}`;
        } catch {
          id = `section-${index}`;
        }

        return (
          <section id={id} key={index}>
            {/* @ts-ignore */}
            <Component {...props} {...extraProps} />
          </section>
        );
      })}

      <FloatingQuickNav items={autoMenu} />
    </div>
  );
}
