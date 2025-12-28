// src/templates/common/BaseSection.tsx

import { memo, type ReactNode } from "react";
import SectionHeader from "./SectionHeader";
import type { SectionMeta } from "@/content/types/sectionMeta";

interface BaseSectionProps {
  id?: string;
  meta?: SectionMeta | null;
  align?: "left" | "center";
  padding?: "sm" | "md" | "lg";
  background?: "default" | "muted";
  children: ReactNode;
  className?: string;
}

const PADDING_MAP = {
  sm: "py-8 md:py-10",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-20",
} as const;

const BG_MAP = {
  default: "bg-background",
  muted: "bg-muted/30",
} as const;

const BaseSection = memo(function BaseSection({
  id,
  meta,
  align = "left",
  padding = "md",
  background = "default",
  className = "",
  children,
}: BaseSectionProps) {
  const hasHeader = Boolean(meta?.title && id);

  const paddingClass = PADDING_MAP[padding] ?? PADDING_MAP.md;
  const bgClass = BG_MAP[background] ?? BG_MAP.default;

  return (
    <section
      id={id}
      aria-labelledby={hasHeader ? `${id}-title` : undefined}
      className={[
        paddingClass,
        bgClass,
        "scroll-mt-32",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="container max-w-6xl">
        {/* ─────────────────────────────
           Section Header (Single Source)
        ───────────────────────────── */}
        {hasHeader && (
          <div className="mb-12 md:mb-14">
            <SectionHeader
              id={`${id}-title`}
              align={align}
              eyebrow={meta!.eyebrow}
              title={meta!.title}
              subtitle={meta!.subtitle}
              tagline={meta!.tagline}
            />
          </div>
        )}

        {/* ─────────────────────────────
           Section Content
        ───────────────────────────── */}
        {children}
      </div>
    </section>
  );
});

export default BaseSection;
