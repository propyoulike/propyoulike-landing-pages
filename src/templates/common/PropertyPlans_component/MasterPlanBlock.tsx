// src/templates/common/PropertyPlans_component/MasterPlanBlock.tsx

import { Card } from "@/components/ui/card";
import { useState } from "react";
import ImageZoomModal from "@/components/image/ImageZoomModal";

interface MasterPlanBlockProps {
  image?: string;
  title?: string;
  description?: string;
}

export default function MasterPlanBlock({
  image,
  title,
  description,
}: MasterPlanBlockProps) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  if (!image) return null;

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 lg:p-8">
          {(title || description) && (
            <div className="mb-6">
              {title && (
                <h3 className="text-xl font-semibold mb-2">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setZoomImage(image)}
            className="relative block w-full cursor-zoom-in focus:outline-none"
            aria-label="Tap to zoom master plan"
            title="Tap to zoom"
          >
            <img
              src={image}
              alt={title ?? "Master Plan"}
              className="w-full h-auto rounded-xl object-contain bg-gray-50"
              loading="lazy"
              draggable={false}
            />
          </button>
        </Card>
      </div>

      {/* Zoom Modal */}
      <ImageZoomModal
        src={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </>
  );
}
