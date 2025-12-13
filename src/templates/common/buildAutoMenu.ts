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
  Views: "Views",
  LocationUI: "Location",
  Construction: "Status",
  PaymentPlans: "Pricing",
  CustomerSpeaks: "Testimonials",
  Brochure: "Brochure",
  BuilderAbout: "About",
  FAQ: "FAQ",
};

// Optional: sub-menu extraction - disabled floor plan submenu per requirements
function extractChildrenFor(name: string, project: ProjectData) {
  // Floor plan submenu disabled for now
  return undefined;
}

export function buildAutoMenuFromResolved(
  resolved: { name: string; id: string; label: string }[],
  project: ProjectData
) {
  // 1) Base items from resolved sections
  let base: AutoMenuItem[] = resolved.map((r) => {
    const cleaned = CLEAN_MAP[r.name] ?? r.label;

    return {
      id: r.id || r.name.toLowerCase(), // fallback ID
      label: cleaned,
      children: extractChildrenFor(r.name, project),
    };
  });

  // 2) Optional navbarConfig overrides from project
  const cfg = (project as any).navbarConfig;

  if (cfg && typeof cfg === "object") {
    const { hidden, visible, order } = cfg as {
      hidden?: string[];
      visible?: string[];
      order?: string[];
    };

    // If "visible" is set & non-empty → only keep those ids
    if (Array.isArray(visible) && visible.length > 0) {
      base = base.filter((item) => visible.includes(item.id));
    }

    // If "hidden" is set & non-empty → drop those ids
    if (Array.isArray(hidden) && hidden.length > 0) {
      base = base.filter((item) => !hidden.includes(item.id));
    }

    // If "order" is set & non-empty → sort by that id order
    if (Array.isArray(order) && order.length > 0) {
      const pos = new Map<string, number>(
        order.map((id, idx) => [id, idx])
      );
      base.sort(
        (a, b) => (pos.get(a.id) ?? 999) - (pos.get(b.id) ?? 999)
      );
    }
  }

  return base;
}
