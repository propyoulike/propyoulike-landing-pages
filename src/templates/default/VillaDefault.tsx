// src/templates/default/VillaDefault.tsx

/**
 * ============================================================
 * VillaDefault Template
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Fallback visual template for Villa-type projects
 * - Delegates rendering to ApartmentDefault
 *
 * WHY THIS EXISTS
 * ------------------------------------------------------------
 * - Villas currently reuse the Apartment fallback UI
 * - Avoids duplicate code while keeping template routing explicit
 *
 * ============================================================
 */

import ApartmentDefault from "./ApartmentDefault";

/**
 * Minimal identity contract for default templates.
 * Kept aligned with ApartmentDefault.
 */
interface VillaDefaultProps {
  project: {
    slug: string;
    builder: string;
    type: string;
    projectName?: string;
    [key: string]: any;
  };
}

/**
 * VillaDefault
 *
 * Intentionally delegates to ApartmentDefault.
 * Delegation is silent by design.
 */
export default function VillaDefault({ project }: VillaDefaultProps) {
  return <ApartmentDefault project={project} />;
}
