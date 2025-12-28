// src/templates/default/PlotDefault.tsx

/**
 * ============================================================
 * PlotDefault Template
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Fallback visual template for Plot-type projects
 * - Delegates rendering to ApartmentDefault
 *
 * WHY THIS EXISTS
 * ------------------------------------------------------------
 * - Plot projects currently reuse the Apartment fallback UI
 * - Avoids duplication while keeping routing explicit
 *
 * ============================================================
 */

import ApartmentDefault from "./ApartmentDefault";

/**
 * Minimal identity contract for default templates.
 * Kept aligned with ApartmentDefault.
 */
interface PlotDefaultProps {
  project: {
    slug: string;
    builder: string;
    type: string;
    projectName?: string;
    [key: string]: any;
  };
}

/**
 * PlotDefault
 *
 * Intentionally delegates to ApartmentDefault.
 * Delegation is silent by design.
 */
export default function PlotDefault({ project }: PlotDefaultProps) {
  return <ApartmentDefault project={project} />;
}
