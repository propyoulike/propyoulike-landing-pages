/**
 * ============================================================
 * buildFloatingNavItems
 *
 * PURPOSE
 * ------------------------------------------------------------
 * - Build a deterministic list of sections eligible for
 *   FloatingQuickNav
 * - Source of truth: sections.config.ts
 *
 * IMPORTANT DESIGN RULES
 * ------------------------------------------------------------
 * 1. ❌ MUST NOT query the DOM
 *    - DOM may not exist yet (hydration timing)
 *
 * 2. ✅ MUST be deterministic
 *    - Same input → same output
 *
 * 3. ✅ DOM existence is validated later (scroll phase)
 *
 * 4. ❌ MUST NOT depend on project, template, or runtime data
 * ============================================================
 */

import sectionsConfig from "@/content/global/sections.config";

type FloatingNavItem = {
  id: string;
  label: string;
};

export function buildFloatingNavItems(): FloatingNavItem[] {
  return sectionsConfig
    .filter(
      (section) =>
        section.menu?.visible === true &&
        typeof section.menu.label === "string"
    )
    .sort(
      (a, b) =>
        (a.menu?.order ?? 0) - (b.menu?.order ?? 0)
    )
    .map((section) => ({
      id: section.id,
      label: section.menu!.label!,
    }));
}
