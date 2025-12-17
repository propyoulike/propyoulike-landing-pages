// src/utils/buildFloatingNav.ts
import sectionsConfig from "@/content/global/sections.config";

export function buildFloatingNavItems() {
  return sectionsConfig
    .filter(
      (s) =>
        s.menu?.visible &&
        s.menu.label &&
        document.getElementById(s.id) // section exists
    )
    .sort((a, b) => (a.menu!.order ?? 0) - (b.menu!.order ?? 0))
    .map((s) => ({
      id: s.id,
      label: s.menu!.label!,
    }));
}
