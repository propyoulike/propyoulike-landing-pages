// src/templates/common/brochure/Brochure_component.tsx

import { memo, useState } from "react";
import BrochurePreview from "./BrochurePreview";
import DocumentList from "./DocumentList";
import BrochureModal from "./BrochureModal";

import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import SectionHeader from "../SectionHeader";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface BrochureProps {
  id?: string;

  /** Canonical section meta */
  meta?: SectionMeta;

  /** Preview image */
  coverImage?: string;

  /** Documents list */
  documents?: {
    label?: string;
    url?: string;
    type?: string;
  }[];
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
const Brochure_component = memo(function Brochure_component({
  id = "brochure",

  meta = {
    eyebrow: "DOWNLOADS",
    title: "Brochure & official documents",
    subtitle:
      "Access brochures, floor plans, approvals and key project details",
    tagline:
      "Everything you need to evaluate the project — in one place",
  },

  coverImage,
  documents = [],
}: BrochureProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { openCTA } = useLeadCTAContext();

  if (!coverImage && !documents.length) return null;

  return (
    <section
      id={id}
      className="py-12 md:py-16 bg-muted/30 scroll-mt-32"
    >
      <div className="container max-w-6xl">

        {/* ─────────────────────────────
           SECTION HEADER (SYSTEMIC)
        ───────────────────────────── */}
        <div className="mb-12">
          <SectionHeader
            eyebrow={meta.eyebrow}
            title={meta.title}
            subtitle={meta.subtitle}
            tagline={meta.tagline}
            align="center"
          />
        </div>

        {/* ─────────────────────────────
           CONTENT
        ───────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* LEFT — Preview */}
          {coverImage && (
            <BrochurePreview
              image={coverImage}
              onPreviewClick={() => setModalOpen(true)}
            />
          )}

          {/* RIGHT — Docs + CTA */}
          <div className="lg:w-1/2 w-full flex flex-col gap-6">
            {documents.length > 0 && (
              <DocumentList documents={documents} />
            )}

            {/* SINGLE PRIMARY ACTION */}
            <Button
              size="lg"
              className="w-full rounded-xl font-semibold"
              onClick={() =>
                openCTA({
                  source: "section",
                  label: "brochure_download",
                })
              }
            >
              Get brochure & pricing
            </Button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────
         PREVIEW MODAL (UNGATED)
      ───────────────────────────── */}
      {coverImage && (
        <BrochureModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          image={coverImage}
        />
      )}
    </section>
  );
});

export default Brochure_component;
