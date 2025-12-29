import { memo, type ReactNode, useEffect, useRef } from "react";
import SectionHeader from "./SectionHeader";
import type { SectionMeta } from "@/content/types/sectionMeta";

import { useTracking } from "@/lib/tracking/TrackingContext";
import { EventName } from "@/lib/analytics/events";
import { SectionId } from "@/lib/analytics/sectionIds";

interface BaseSectionProps {
  id?: SectionId;
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

  /* -------------------------------------------------
     Analytics: auto section_view (fire once)
  -------------------------------------------------- */
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTracked = useRef(false);
  const { track } = useTracking();

  useEffect(() => {
    if (!id || !sectionRef.current || hasTracked.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          hasTracked.current = true;

          track(EventName.SectionView, {
            section_id: id,
          });

          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [id, track]);

  return (
    <section
      ref={sectionRef}
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

        {children}
      </div>
    </section>
  );
});

export default BaseSection;
