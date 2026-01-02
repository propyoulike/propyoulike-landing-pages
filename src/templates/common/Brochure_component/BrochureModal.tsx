// src/templates/common/brochure/BrochureModal.tsx

import { memo, useEffect } from "react";
import { X } from "lucide-react";

interface BrochureModalProps {
  open: boolean;
  onClose: () => void;
  image?: string;
}

/**
 * BrochureModal
 * ------------------------------------------------------------
 * GUARANTEES:
 * - Hook order safe (StrictMode / Concurrent)
 * - Body scroll correctly locked & restored
 * - CLS-safe modal layout
 * - ESC + backdrop close
 * - Accessible dialog semantics
 */
const BrochureModal = memo(function BrochureModal({
  open,
  onClose,
  image,
}: BrochureModalProps) {
  /* --------------------------------------------------
     Lock body scroll (SAFE)
  --------------------------------------------------- */
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  /* --------------------------------------------------
     ESC to close
  --------------------------------------------------- */
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* --------------------------------------------------
     Guard render AFTER hooks
  --------------------------------------------------- */
  if (!open || !image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Brochure preview"
      onClick={onClose}
    >
      <div
        className="
          relative bg-background
          w-full max-w-4xl max-h-[90vh]
          rounded-xl overflow-hidden
          shadow-2xl flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- Header ---------- */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Brochure Preview
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="
              p-2 rounded-full
              hover:bg-muted
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-primary
            "
            aria-label="Close brochure preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ---------- Image Container (CLS SAFE) ---------- */}
        <div
          className="
            flex-1 overflow-auto
            bg-muted
            overscroll-contain
            touch-pan-x touch-pan-y
          "
        >
          <div className="relative w-full aspect-[3/4]">
            <img
              src={image}
              alt="Project brochure preview"
              loading="eager"
              decoding="async"
              draggable={false}
              className="
                absolute inset-0
                w-full h-full
                object-contain
                select-none
              "
            />
          </div>
        </div>

        {/* ---------- Mobile hint ---------- */}
        <div className="text-center text-xs text-muted-foreground py-2">
          Pinch to zoom · Tap outside to close
        </div>
      </div>
    </div>
  );
});

export default BrochureModal;
