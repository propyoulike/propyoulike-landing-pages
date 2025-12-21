// src/templates/common/BaseSection.tsx

import type { ReactNode } from "react";
import SectionHeader from "./SectionHeader";
import type { SectionMeta } from "@/content/types/sectionMeta";

interface BaseSectionProps {
  id: string;
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
};

const BG_MAP = {
  default: "bg-background",
  muted: "bg-muted/30",
};

export default function BaseSection({
  id,
  meta,
  align = "left",
  padding = "md",
  background = "default",
  className = "",
  children,
}: BaseSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={meta ? `${id}-title` : undefined}
      className={[
        PADDING_MAP[padding],
        BG_MAP[background],
        "scroll-mt-32",
        className,
      ].join(" ")}
    >
      <div className="container max-w-6xl">

        {/* ✅ SINGLE SOURCE OF HEADER */}
{meta && (
  <div className="mb-12 md:mb-14">
    <SectionHeader
      id={`${id}-title`}
      align={align}
      eyebrow={meta.eyebrow}
      title={meta.title}
      subtitle={meta.subtitle}
      tagline={meta.tagline}
    />
  </div>
)}

        {children}
      </div>
    </section>
  );
}
