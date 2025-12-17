// src/templates/common/brochure/BrochureModal.tsx
import { memo, useEffect } from "react";
import { X } from "lucide-react";

interface BrochureModalProps {
  open: boolean;
  onClose: () => void;
  image?: string;
}

const BrochureModal = memo(function BrochureModal({
  open,
  onClose,
  image,
}: BrochureModalProps) {
  /* ---------- Guard ---------- */
  if (!open || !image) return null;

  /* ---------- Lock body scroll ---------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* ---------- ESC to close ---------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="
          relative bg-background w-full max-w-4xl max-h-[90vh]
          rounded-xl overflow-hidden shadow-2xl
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- Header ---------- */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Brochure Preview
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close brochure preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ---------- Image (Zoomable, Scrollable) ---------- */}
        <div
          className="
            flex-1 overflow-auto
            touch-pan-x touch-pan-y
            overscroll-contain
            bg-muted
          "
        >
          <img
            src={image}
            alt="Project brochure preview"
            className="
              mx-auto my-4
              max-w-none w-full
              object-contain
              select-none
            "
            draggable={false}
          />
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
