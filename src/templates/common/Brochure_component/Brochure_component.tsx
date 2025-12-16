// src/templates/common/brochure/Brochure_component.tsx
import { memo, useState } from "react";
import BrochurePreview from "./BrochurePreview";
import DocumentList from "./DocumentList";
import BrochureModal from "./BrochureModal";
import CTAButtons from "@/components/CTAButtons";

const Brochure_component = memo(function Brochure_component({
  id = "brochure",
  heroTitle,
  heroSubtitle,
  coverImage,
  documents = [],
  onCtaClick,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id={id} className="py-20 lg:py-28 bg-muted/30 scroll-mt-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10 items-center">

          {/* LEFT — Preview */}
          <BrochurePreview
            image={coverImage}
            title={heroTitle}
            subtitle={heroSubtitle}
            onPreviewClick={() => setModalOpen(true)}
          />

          {/* RIGHT — Documents */}
          <div className="lg:w-1/2 w-full flex flex-col gap-6">
            <DocumentList documents={documents} />
          </div>
        </div>
      </div>

      {/* Modal (optional) */}
      <BrochureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        image={coverImage}
      />

      {/* ------------ CTA (Global Component) ------------ */}
      {onCtaClick && (
        <div className="container max-w-4xl mt-10">
          <CTAButtons onPrimaryClick={onCtaClick} />
        </div>
      )}

    </section>
  );
});

export default Brochure_component;