// src/lib/analytics/guards.ts

import { EventName } from "./events";
import { SectionId } from "./sectionIds";
import { CTAType } from "./ctaTypes";
import { LeadType } from "./leadTypes";

export function assertValidEvent(
  name: EventName,
  props: Record<string, any>
) {
  // ─────────────────────────────────
  // section_view
  // ─────────────────────────────────
  if (name === EventName.SectionView) {
    if (!props.section_id) {
      throw new Error("❌ section_view requires section_id");
    }

    if (!Object.values(SectionId).includes(props.section_id)) {
      throw new Error(
        `❌ Invalid section_id: ${props.section_id}`
      );
    }
  }

  // ─────────────────────────────────
  // cta_click
  // ─────────────────────────────────
  if (name === EventName.CTAClick) {
    if (!props.cta_type) {
      throw new Error("❌ cta_click requires cta_type");
    }

    if (!Object.values(CTAType).includes(props.cta_type)) {
      throw new Error(
        `❌ Invalid cta_type: ${props.cta_type}`
      );
    }
  }

  // ─────────────────────────────────
  // lead_created
  // ─────────────────────────────────
  if (name === EventName.LeadCreated) {
    if (!props.lead_type) {
      throw new Error("❌ lead_created requires lead_type");
    }

    if (!Object.values(LeadType).includes(props.lead_type)) {
      throw new Error(
        `❌ Invalid lead_type: ${props.lead_type}`
      );
    }
  }
}
