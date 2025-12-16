//src/templates/common/PropertyPlans_component/FloorPlanCard.tsx

import { Card } from "@/components/ui/card";

export default function FloorPlanCard({ title, image, description, onZoom }) {
  return (
    <Card className="p-6 rounded-2xl shadow-lg max-w-md w-full">
      <img
        src={image}
        className="w-full aspect-[4/3] object-contain rounded-xl bg-gray-50 cursor-zoom-in"
        onClick={onZoom}
      />

      {title && <h3 className="text-lg font-semibold mt-4">{title}</h3>}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </Card>
  );
}
