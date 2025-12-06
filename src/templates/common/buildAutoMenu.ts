// src/templates/common/buildAutoMenu.ts
import type { ProjectData } from "@/content/schema/project.schema";

export type AutoMenuItem = {
  id: string;
  label: string;
  icon?: string;
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

// Optional: sub-menu extraction
function extractChildrenFor(name: string, project: ProjectData) {
  if (name === "FloorPlansSection" && project.floorPlansSection?.unitPlans) {
    return project.floorPlansSection.unitPlans.map((u, i) => ({
      id: `unitplan-${i}`,
      label: u.title,
    }));
  }
}

export function buildAutoMenuFromResolved(
  resolved: { name: string; id: string; label: string }[],
  project: ProjectData
) {
  let base: AutoMenuItem[] = resolved.map((r) => {
    const cleaned = CLEAN_MAP[r.name] ?? r.label;

    return {
      id: r.id,
      label: cleaned,
      children: extractChildrenFor(r.name, project),
    };
  });

  // Apply optional navbarConfig overrides
  const cfg = (project as any).navbarConfig;
  if (cfg) {
    if (cfg.hidden) base = base.filter((b) => !cfg.hidden.includes(b.label));
    if (cfg.visible) base = base.filter((b) => cfg.visible.includes(b.label));
    if (cfg.order) {
      const order = new Map<string, number>(cfg.order.map((val: string, idx: number) => [val, idx]));
      base.sort(
        (a, b) => {
          const orderA = order.get(a.label) ?? 999;
          const orderB = order.get(b.label) ?? 999;
          return orderA - orderB;
        }
      );
    }
  }

  return base;
}
