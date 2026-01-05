// src/templates/common/brochure/Brochure_component.tsx

/**
 * ============================================================
 * Brochure Section
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Displays brochure cover preview
 * - Lists downloadable official documents
 * - Provides CTA to request brochure/pricing
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * - Pure render from props
 * - NO project identity access
 * - NO resolver assumptions
 * - Safe in SSR / prerender / runtime
 * - Identical behavior in DEV and PROD
 *
 * ============================================================
 */

import { memo, useMemo, useState } from "react";

import BrochurePreview from "./BrochurePreview";
import DocumentList from "./DocumentList";
import BrochureModal from "./BrochureModal";

import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   UI CONTRACT
------------------------------------------------------------------------*/
interface BrochureDocument {
  title: string;
  url: string;
}

interface BrochureProps {
  id?: string;
  meta?: SectionMeta;
  coverImage?: unknown;
  documents?: unknown;
}

/* ---------------------------------------------------------------------
   DEFAULT META
------------------------------------------------------------------------*/
const DEFAULT_META: SectionMeta = {
  eyebrow: "DOWNLOADS",
  title: "Brochure & official documents",
  subtitle:
    "Access brochures, floor plans, approvals and key project details",
  tagline:
    "Everything you need to evaluate the project — in one place",
};

/* ---------------------------------------------------------------------
   SAFE OPTIONAL CTA ACCESS
------------------------------------------------------------------------*/
function useOptionalLeadCTA() {
  try {
    return useLeadCTAContext();
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
const BrochureComponent = memo(function BrochureComponent({
  id = "brochure",
  meta = DEFAULT_META,
  coverImage,
  documents,
}: BrochureProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const leadCTA = useOptionalLeadCTA();

  /* ------------------------------------------------------------
     DEV CONTRACT VALIDATION
  ------------------------------------------------------------ */
  if (import.meta.env.DEV && documents !== undefined) {
    if (!Array.isArray(documents)) {
      throw new Error(
        "[Brochure_component] `documents` must be an array"
      );
    }

    const invalid = documents.some(
      (d: any) =>
        !d ||
        typeof d.title !== "string" ||
        typeof d.url !== "string"
    );

    if (invalid) {
      throw new Error(
        "[Brochure_component] Invalid document mapping. Expected { title, url }"
      );
    }
  }

  /* ------------------------------------------------------------
     SANITIZATION (PROD SAFE)
  ------------------------------------------------------------ */
  const safeCoverImage =
    typeof coverImage === "string" && coverImage.trim().length > 0
      ? coverImage
      : null;

  const safeDocuments: BrochureDocument[] = useMemo(() => {
    if (!Array.isArray(documents)) return [];

    return documents.filter(
      (d): d is BrochureDocument =>
        typeof d?.title === "string" &&
        typeof d?.url === "string" &&
        d.url.trim().length > 0
    );
  }, [documents]);

  /* ------------------------------------------------------------
     GUARD — NOTHING TO RENDER
  ------------------------------------------------------------ */
  if (!safeCoverImage && safeDocuments.length === 0) {
    return null;
  }

  /* ------------------------------------------------------------
     RENDER
  ------------------------------------------------------------ */
  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
      background="muted"
    >
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* COVER PREVIEW */}
        {safeCoverImage && (
          <BrochurePreview
            image={safeCoverImage}
            onPreviewClick={() => setModalOpen(true)}
          />
        )}

        {/* DOCUMENTS + CTA */}
        <div className="lg:w-1/2 w-full flex flex-col gap-6">
          {safeDocuments.length > 0 && (
            <DocumentList documents={safeDocuments} />
          )}

          {leadCTA && (
            <Button
              size="lg"
              className="w-full rounded-xl font-semibold"
              onClick={() =>
                leadCTA.openCTA({
                  source: "section",
                  title: "brochure_download",
                })
              }
            >
              Get brochure & pricing
            </Button>
          )}
        </div>
      </div>

      {/* MODAL */}
      {safeCoverImage && modalOpen && (
        <BrochureModal
          open
          image={safeCoverImage}
          onClose={() => setModalOpen(false)}
        />
      )}
    </BaseSection>
  );
});

export default BrochureComponent;
