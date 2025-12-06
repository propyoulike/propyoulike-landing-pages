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
  console.log("[MenuBuilder] resolved input:", resolved);

  let base: AutoMenuItem[] = resolved.map((r) => {
    const cleaned = CLEAN_MAP[r.name] ?? r.label;

    return {
      // ⭐ FIX: Ensure ID never becomes empty
      id: r.id || r.name.toLowerCase(),
      label: cleaned,
      children: extractChildrenFor(r.name, project),
    };
  });

  // ⭐ FIX: Only apply filtering if config has real settings
  const cfg = (project as any).navbarConfig;
  if (cfg && Object.keys(cfg).length > 0) {

    if (cfg.hidden) {
      base = base.filter((b) => !cfg.hidden.includes(b.id));
    }

    if (cfg.visible) {
      base = base.filter((b) => cfg.visible.includes(b.id));
    }

    if (cfg.order) {
      const order = new Map<string, number>(
        cfg.order.map((val: string, idx: number) => [val, idx])
      );

      base.sort((a, b) => {
        const orderA = order.get(a.label) ?? 999;
        const orderB = order.get(b.label) ?? 999;
        return orderA - orderB;
      });
    }
  }

  console.log("[MenuBuilder] final autoMenu:", base);
  return base;
}
