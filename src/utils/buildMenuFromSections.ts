// src/utils/buildMenuFromSections.ts
export function buildMenuFromSections(sections: any[]) {
  return sections
    .filter((s) => s.menu?.visible)
    .sort((a, b) => a.menu.order - b.menu.order)
    .map((s) => ({
      id: s.id,
      label: s.menu.label,
      order: s.menu.order,
      children: s.menu.children ?? []
    }));
}
