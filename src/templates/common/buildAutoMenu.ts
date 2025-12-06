// src/templates/common/buildAutoMenu.ts
import type { ProjectData } from "@/content/schema/project.schema";

export type AutoMenuItem = {
  id: string;
  label: string;
  order?: number; // NEW ⭐ for deterministic ordering
  children?: AutoMenuItem[];
};

const CLEAN_MAP: Record<string, string> = {
  Hero: "Home",
  Navbar: "Top",
  Summary: "Summary",
  FloorPlansSection: "Floor Plans",
  Amenities: "Amenities",
  Views: "Gallery",
  LocationUI: "Location",
  Construction: "Status",
  PaymentPlans: "Pricing",
  CustomerSpeaks: "Testimonials",
  Brochure: "Brochure",
  BuilderAbout: "About",
  FAQ: "FAQ",
};

function extractChildrenFor(name: string, project: ProjectData) {
  if (name === "FloorPlansSection" && project.floorPlansSection?.unitPlans) {
    return project.floorPlansSection.unitPlans.map((u, i) => ({
      id: `unitplan-${i}`,
      label: u.title,
    }));
  }
}

export function buildAutoMenuFromResolved(
  resolved: { name: string; id: string; label: string; order?: number }[],
  project: ProjectData
) {

  let base: AutoMenuItem[] = resolved.map((r) => ({
    id: r.id || r.name.toLowerCase(),
    label: CLEAN_MAP[r.name] ?? r.label,
    order: (SECTIONS as any)[r.name]?.menuOrder ?? 999,
    children: extractChildrenFor(r.name, project),
  }));

  const cfg = (project as any).navbarConfig;

  if (cfg && Object.keys(cfg).length > 0) {

    if (cfg.hidden && cfg.hidden.length > 0) {
      base = base.filter((b) => !cfg.hidden.includes(b.id));
    }

    if (cfg.visible && cfg.visible.length > 0) {
      base = base.filter((b) => cfg.visible.includes(b.id));
    }

    if (cfg.order && cfg.order.length > 0) {
      const order = new Map<string, number>(
        cfg.order.map((val: string, idx: number) => [val, idx])
      );
      base.sort((a, b) => (order.get(a.label) ?? 999) - (order.get(b.label) ?? 999));
    }
  }

  base.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return base;
}
