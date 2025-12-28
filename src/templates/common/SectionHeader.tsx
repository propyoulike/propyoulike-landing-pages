// src/templates/common/SectionHeader.tsx

/**
 * ============================================================
 * SectionHeader
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Canonical header renderer for all content sections
 * - Displays eyebrow, title, subtitle, and optional tagline
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * ✅ Pure presentational component
 * ✅ No side effects
 * ✅ No logging
 * ✅ Fail-soft (never throws)
 * ✅ Schema-aligned with SectionMeta
 *
 * ============================================================
 */

import { memo } from "react";
import type { SectionMeta } from "@/content/types/sectionMeta";

interface SectionHeaderProps extends SectionMeta {
  /**
   * Text alignment
   */
  align?: "left" | "center";

  /**
   * Optional anchor id for navigation / deep links
   */
  id?: string;
}

const SectionHeader = memo(function SectionHeader({
  eyebrow,
  title,
  subtitle,
  tagline,
  align = "left",
  id,
}: SectionHeaderProps) {
  /* ----------------------------------------------------------
     Fail-soft guard
     ----------------------------------------------------------
     Title is semantically required for a section.
     If missing, do not render header at all.
  ---------------------------------------------------------- */
  if (!title) return null;

  return (
    <header
      id={id}
      className={[
        "section-header",
        align === "center" ? "section-header--center" : "",
      ].join(" ")}
    >
      {eyebrow && (
        <p className="section-header__eyebrow">
          {eyebrow}
        </p>
      )}

      <h2 className="section-header__title">
        {title}
      </h2>

      {subtitle && (
        <p className="section-header__subtitle">
          {subtitle}
        </p>
      )}

      {tagline && (
        <p className="section-header__tagline">
          {tagline}
        </p>
      )}
    </header>
  );
});

export default SectionHeader;
