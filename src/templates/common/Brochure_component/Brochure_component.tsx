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
 * - No project identity access
 * - No resolver / authoring assumptions
 * - Safe in SSR / prerender / runtime
 * - Identical behavior in DEV and PROD
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. CONTRACT FIRST
 *    → Component consumes ONLY UI contract
 *
 * 2. FAIL LOUD IN DEV, SILENT IN PROD
 *    → Resolver bugs are caught early
 *
 * 3. DEFENSIVE RENDERING
 *    → Invalid data never breaks UI
 *
 * ============================================================
 */

import { memo, useState, useMemo } from "react";

import BrochurePreview from "./BrochurePreview";
import DocumentList from "./DocumentList";
import BrochureModal from "./BrochureModal";

import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   UI CONTRACT TYPES
------------------------------------------------------------------------*/
interface BrochureDocument {
  /** Display title (mapped from authoring title) */
  title: string;

  /** Absolute document URL */
  url: string;
}

interface BrochureProps {
  /** Section anchor id */
  id?: string;

  /** Canonical section meta */
  meta?: SectionMeta;

  /** Brochure cover image URL */
  coverImage?: unknown;

  /** Resolver-mapped documents list */
  documents?: unknown;
}

/* ---------------------------------------------------------------------
   DEFAULT META (STABLE FALLBACK)
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
   SAFE CONTEXT ACCESS
   (Component must not assume provider presence)
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
     DEV SAFETY GUARD
     ------------------------------------------------------------
     Ensures resolver mapping obeys UI contract:
     [{ title: string, url: string }]
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
    typeof coverImage === "string" &&
    coverImage.trim().length > 0
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
     GUARD — NO CONTENT
     ------------------------------------------------------------
     Section renders ONLY when meaningful content exists
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
        {/* LEFT — COVER PREVIEW (VISUAL ONLY) */}
        {safeCoverImage && (
          <BrochurePreview
            image={safeCoverImage}
            onPreviewClick={() => setModalOpen(true)}
          />
        )}

        {/* RIGHT — DOCUMENTS + CTA */}
        <div className="lg:w-1/2 w-full flex flex-col gap-6">
          {safeDocuments.length > 0 && (
            <DocumentList
              documents={safeDocuments.map((d) => ({
                title: d.title,
                url: d.url,
              }))}
            />
          )}

          {leadCTA && (
            <Button
              size="lg"
              className="w-full rounded-xl font-semibold"
              onClick={() =>
                leadCTA.openCTA({
                  source: "section",
                  title: "brochure_download",
                  builderId: project.builder,
                })
              }
            >
              Get brochure & pricing
            </Button>
          )}
        </div>
      </div>

      {/* MODAL PREVIEW */}
      {safeCoverImage && modalOpen && (
        <BrochureModal
          open
          onClose={() => setModalOpen(false)}
          image={safeCoverImage}
        />
      )}
    </BaseSection>
  );
});

export default BrochureComponent;
