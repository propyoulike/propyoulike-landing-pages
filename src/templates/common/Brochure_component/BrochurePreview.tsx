// src/templates/common/Brochure/BrochurePreview.tsx

import { memo, useState } from "react";

interface BrochurePreviewProps {
  image?: string | null;
  onPreviewClick?: () => void;
}

/**
 * BrochurePreview
 * ------------------------------------------------------------
 * PERFORMANCE GUARANTEES:
 * - Not eligible for LCP
 * - CLS-safe (fixed aspect ratio)
 * - Lazy-loaded media
 * - Graceful fallback on image error
 * - Accessible click target
 */
const BrochurePreview = memo(function BrochurePreview({
  image,
  onPreviewClick,
}: BrochurePreviewProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(image) && !imageFailed;

  return (
    <section className="w-full lg:w-1/2">
      {hasImage ? (
        <button
          type="button"
          onClick={onPreviewClick}
          className="
            group block w-full text-left
            focus:outline-none focus-visible:ring-2
            focus-visible:ring-primary/60 rounded-2xl
          "
          aria-label="Preview project brochure"
        >
          {/* --------------------------------------------------
             MEDIA SLOT (CLS SAFE)
          --------------------------------------------------- */}
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <img
              src={image!}
              alt="Project brochure preview"
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="
                absolute inset-0 w-full h-full object-cover
                transition-opacity duration-300
                group-hover:opacity-90
              "
            />
          </div>
        </button>
      ) : (
        /* --------------------------------------------------
           FALLBACK (NO LAYOUT SHIFT)
        --------------------------------------------------- */
        <div
          className="
            w-full aspect-[4/3] rounded-2xl
            bg-muted flex items-center justify-center
            text-muted-foreground text-sm text-center
            px-4
          "
        >
          Brochure preview available on request
        </div>
      )}
    </section>
  );
});

export default BrochurePreview;
