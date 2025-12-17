// src/utils/buildMenuFromSections.ts

export function buildMenuFromSections(sections: any[] = []) {
  return sections
    .filter(Boolean)
    .filter((s) => s.menu?.visible)
    .sort((a, b) => (a.menu?.order ?? 0) - (b.menu?.order ?? 0))
    .map((s) => ({
      id: s.id,
      label: s.menu?.label ?? s.id,
      order: s.menu?.order ?? 0,
      children: s.menu?.children ?? [],
    }));
}
