// src/templates/common/SectionHeader.tsx

import type { SectionMeta } from "@/content/types/sectionMeta";

interface SectionHeaderProps extends SectionMeta {
  align?: "left" | "center";
  id?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  tagline,
  align = "left",
  id,
}: SectionHeaderProps) {
  return (
    <header
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

      <h2 id={id} className="section-header__title">
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
}
