/**
 * ============================================================
 * Summary_component
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Provides a high-level overview of the project
 * - Surfaces key highlights and positioning
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * - Pure render from props
 * - No side effects
 * - No browser or routing dependencies
 * - Safe for SSR / hydration
 *
 * ============================================================
 */

import SummaryList from "./SummaryList";
import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   PROPS
------------------------------------------------------------------------*/
interface SummaryProps {
  id?: string;
  meta?: SectionMeta | null;
  description?: string;
  highlights?: string[];
}

/* ---------------------------------------------------------------------
   DEFAULT META
------------------------------------------------------------------------*/
const DEFAULT_META: SectionMeta = {
  eyebrow: "OVERVIEW",
  title: "Project Overview",
  subtitle: "Everything you should know before you visit",
  tagline: "A quick snapshot before you explore further",
};

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function Summary_component({
  id = "summary",
  meta,
  description,
  highlights = [],
}: SummaryProps) {
  const resolvedMeta =
    meta === null ? null : { ...DEFAULT_META, ...meta };

  const hasContent =
    !!resolvedMeta?.title ||
    !!resolvedMeta?.subtitle ||
    !!description ||
    highlights.length > 0;

  if (!hasContent) return null;

  return (
    <BaseSection id={id} meta={resolvedMeta} padding="md" align="center">
      <div className="max-w-4xl">
        {description && (
          <p className="mt-6 text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}

        {highlights.length > 0 && (
          <div className="mt-6">
            <SummaryList items={highlights} />
          </div>
        )}
      </div>
    </BaseSection>
  );
}
