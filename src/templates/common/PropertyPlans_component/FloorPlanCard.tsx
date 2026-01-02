// src/templates/common/PropertyPlans_component/FloorPlanCard.tsx

import { Card } from "@/components/ui/card";
import { ZoomIn } from "lucide-react";
import { cfImage } from "@/lib/media/cloudflareImage";

interface FloorPlanCardProps {
  title?: string;
  image?: string;
  description?: string;
  onZoom?: (src?: string) => void;
}

export default function FloorPlanCard({
  title,
  image,
  description,
  onZoom,
}: FloorPlanCardProps) {
  const isZoomable = Boolean(onZoom && image);

  const previewSrc = image
    ? cfImage(image, { width: 800 })
    : undefined;

  const zoomSrc = image
    ? cfImage(image, { width: 2200, quality: 90 })
    : undefined;

  return (
    <Card className="p-6 rounded-2xl shadow-md max-w-md w-full">
      {/* ---------- IMAGE / PREVIEW ---------- */}
      <button
        type="button"
        aria-label={title ? `Zoom ${title} floor plan` : "Zoom floor plan"}
        disabled={!isZoomable}
        onClick={() => onZoom?.(zoomSrc)}
        className={`
          relative w-full aspect-[4/3]
          rounded-xl bg-muted overflow-hidden
          transition-transform duration-300
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
          ${isZoomable ? "cursor-zoom-in hover:scale-[1.02]" : "cursor-default"}
        `}
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={title || "Floor plan"}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Floor plan coming soon
          </div>
        )}

        {/* ---------- ZOOM ICON ---------- */}
        {isZoomable && (
          <span
            aria-hidden
            className="
              absolute bottom-3 right-3
              flex items-center justify-center
              w-9 h-9 rounded-full
              bg-background/90 shadow
            "
          >
            <ZoomIn className="w-4 h-4 text-foreground" />
          </span>
        )}
      </button>

      {/* ---------- TEXT ---------- */}
      {title && (
        <h3 className="text-lg font-semibold mt-4 leading-tight">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {description}
        </p>
      )}
    </Card>
  );
}
