// src/templates/common/PropertyPlans_component/UnitPlanCard.tsx

import { Card } from "@/components/ui/card";

interface UnitPlanCardProps {
  title?: string;
  description?: string;
  sba?: string;
  ca?: string;
  usable?: string;
  uds?: string;
  floorPlanImage?: string;
  onZoom?: () => void;
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
  return (
    <Card className="p-6 rounded-2xl shadow-md max-w-md w-full bg-card">

      {floorPlanImage && (
        <button
          type="button"
          onClick={onZoom}
          className="block w-full cursor-zoom-in focus:outline-none"
          aria-label="Tap to zoom unit plan"
          title="Tap to zoom"
        >
          <img
            src={floorPlanImage}
            alt={title || "Unit plan"}
            className="w-full aspect-[4/3] object-contain rounded-xl bg-muted"
            draggable={false}
          />
        </button>
      )}

      <div className="mt-4 space-y-3">
        {title && (
          <h3 className="text-xl font-semibold">
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
