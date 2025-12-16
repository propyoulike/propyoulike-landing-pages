// src/templates/common/brochure/BrochureModal.tsx
import { memo } from "react";
import { X } from "lucide-react";

const BrochureModal = memo(function BrochureModal({
  open,
  onClose,
  image,
}) {
  if (!open || !image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground">Brochure Preview</h3>
          <button className="p-2 hover:bg-muted rounded-full" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <img
          src={image}
          alt="Brochure"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
});

export default BrochureModal;
