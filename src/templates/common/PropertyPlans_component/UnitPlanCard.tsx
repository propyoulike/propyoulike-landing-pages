// src/templates/common/PropertyPlans_component/UnitPlanCard.tsx

import { Card } from "@/components/ui/card";
import { ZoomIn } from "lucide-react";
import { cfImage } from "@/lib/media/cloudflareImage";

interface UnitPlanCardProps {
  title?: string;
  description?: string;
  sba?: string;
  ca?: string;
  usable?: string;
  uds?: string;
  floorPlanImage?: string;
  onZoom?: (src?: string) => void;
}

export default function UnitPlanCard({
  title,
  description,
  sba,
  ca,
  usable,
  uds,
  floorPlanImage,
  onZoom,
}: UnitPlanCardProps) {
  const isZoomable = Boolean(onZoom && floorPlanImage);

  const previewSrc = floorPlanImage
    ? cfImage(floorPlanImage, { width: 800 })
    : undefined;

  const zoomSrc = floorPlanImage
    ? cfImage(floorPlanImage, { width: 2200, quality: 90 })
    : undefined;

  return (
    <Card className="p-6 rounded-2xl shadow-md max-w-md w-full bg-card">
      {/* ---------- IMAGE ---------- */}
      <button
        type="button"
        disabled={!isZoomable}
        onClick={() => onZoom?.(zoomSrc)}
        aria-label={title ? `Zoom ${title} unit plan` : "Zoom unit plan"}
        className={`
          relative w-full aspect-[4/3]
          rounded-xl bg-muted overflow-hidden
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
          transition-transform duration-300
          ${isZoomable ? "cursor-zoom-in hover:scale-[1.02]" : "cursor-default"}
        `}
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={title || "Unit plan"}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Unit plan coming soon
          </div>
        )}

        {isZoomable && (
          <span
            aria-hidden
            className="
              absolute bottom-3 right-3
              w-9 h-9 rounded-full
              bg-background/90 shadow
              flex items-center justify-center
            "
          >
            <ZoomIn className="w-4 h-4" />
          </span>
        )}
      </button>

      {/* ---------- CONTENT ---------- */}
      <div className="mt-4 space-y-3">
        {title && (
          <h3 className="text-xl font-semibold leading-tight">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <div className="text-sm space-y-1">
          {sba && <p><strong>SBA:</strong> {sba}</p>}
          {ca && <p><strong>Carpet:</strong> {ca}</p>}
          {usable && <p><strong>Usable:</strong> {usable}</p>}
          {uds && <p><strong>UDS:</strong> {uds}</p>}
        </div>
      </div>
    </Card>
  );
}
