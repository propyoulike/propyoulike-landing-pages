// src/templates/common/brochure/Brochure_component.tsx
import { memo, useState } from "react";
import BrochurePreview from "./BrochurePreview";
import DocumentList from "./DocumentList";
import BrochureModal from "./BrochureModal";
import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";

const Brochure_component = memo(function Brochure_component({
  id = "brochure",
  title = "Project Brochure & Documents",
  subtitle = "Download official brochures, floor plans and approvals",
  coverImage,
  documents = [],
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { openCTA } = useLeadCTAContext();

  if (!coverImage && !documents.length) return null;

  return (
    <section
      id={id}
      className="py-20 lg:py-28 bg-muted/30 scroll-mt-32"
    >
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ✅ SECTION HEADER — CONSISTENT */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* LEFT — Preview */}
          <BrochurePreview
            image={coverImage}
            onPreviewClick={() => setModalOpen(true)}
          />

          {/* RIGHT — Documents + CTA */}
          <div className="lg:w-1/2 w-full flex flex-col gap-6">
            <DocumentList documents={documents} />

            {/* SINGLE PRIMARY ACTION */}
            <Button
              size="lg"
              className="w-full rounded-xl font-semibold"
              onClick={() =>
                openCTA({
                  source: "section",
                  label: "Brochure – Get Details",
                })
              }
            >
              Get Brochure & Pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Modal (ungated) */}
      <BrochureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        image={coverImage}
      />
    </section>
  );
});

export default Brochure_component;
