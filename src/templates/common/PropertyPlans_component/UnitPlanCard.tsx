//src/templates/common/PropertyPlans_component/UnitPlanCard.tsx

import { Card } from "@/components/ui/card";

export default function UnitPlanCard({
  title,
  description,
  sba,
  ca,
  usable,
  uds,
  floorPlanImage,
  onZoom,
  onCta
}) {
  return (
    <Card className="p-6 rounded-2xl shadow-lg max-w-md w-full">

      <img
        src={floorPlanImage}
        className="w-full aspect-[4/3] object-contain rounded-xl cursor-zoom-in bg-gray-50"
        onClick={onZoom}
      />

      <h3 className="text-xl font-semibold mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div className="text-sm space-y-1">
        {sba && <p><strong>SBA:</strong> {sba}</p>}
        {ca && <p><strong>Carpet:</strong> {ca}</p>}
        {usable && <p><strong>Usable:</strong> {usable}</p>}
        {uds && <p><strong>UDS:</strong> {uds}</p>}
      </div>

      {onCta && (
        <button
          onClick={onCta}
          className="w-full mt-6 py-3 rounded-xl bg-primary text-white font-semibold"
        >
          Schedule a Site Visit
        </button>
      )}
    </Card>
  );
}
