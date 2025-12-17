// src/templates/common/PropertyPlans_component/FloorPlanCard.tsx

import { Card } from "@/components/ui/card";

interface FloorPlanCardProps {
  title?: string;
  image?: string;
  description?: string;
  onZoom?: () => void;
}

export default function FloorPlanCard({
  title,
  image,
  description,
  onZoom,
}: FloorPlanCardProps) {
  return (
    <Card className="p-6 rounded-2xl shadow-md max-w-md w-full">
      {/* --- IMAGE WRAPPER (RATIO LOCKED) --- */}
      <div
        className="relative aspect-[4/3] rounded-xl bg-muted overflow-hidden cursor-zoom-in transition-transform duration-300 hover:scale-[1.02]"
        onClick={onZoom}
      >
        {image && (
          <img
            src={image}
            alt={title || "Floor plan"}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {title && (
        <h3 className="text-lg font-semibold mt-4">
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
