/**
 * ============================================================
 * buildFloatingNavItems
 *
 * Builds a concise, mobile-friendly navigation list
 * for FloatingQuickNav
 * ============================================================
 */

import sectionsConfig from "@/content/global/sections.config";

type FloatingNavItem = {
  id: string;
  label: string;
};

/**
 * Sections that are structurally important
 * but NOT suitable for quick navigation
 */
const EXCLUDED_SECTION_IDS = new Set([
  "hero",
  "summary",
  "about-builder",
  "trust-and-clarity",
  "testimonials",
  "faq",
  "footer",
]);

/**
 * Hard cap for mobile readability
 */
const MAX_ITEMS = 6;

export function buildFloatingNavItems(): FloatingNavItem[] {
  return sectionsConfig
    .filter(
      (section) =>
        section.menu?.visible === true &&
        typeof section.menu.label === "string" &&
        !EXCLUDED_SECTION_IDS.has(section.id)
    )
    .sort(
      (a, b) =>
        (a.menu?.order ?? 0) - (b.menu?.order ?? 0)
    )
    .slice(0, MAX_ITEMS)
    .map((section) => ({
      id: section.id,
      label: section.menu!.label!,
    }));
}
