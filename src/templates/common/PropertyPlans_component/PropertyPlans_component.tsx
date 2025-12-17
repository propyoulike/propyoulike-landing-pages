// src/templates/common/PropertyPlans_component/PropertyPlans_component.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

import ImageZoomModal from "@/components/image/ImageZoomModal";
import MasterPlanBlock from "./MasterPlanBlock";
import FloorPlanCard from "./FloorPlanCard";
import UnitPlanCard from "./UnitPlanCard";
import CTAButtons from "@/components/CTAButtons";

interface Props {
  title?: string;
  subtitle?: string;
  tagline?: string;

  floorPlans?: { title?: string; image?: string; description?: string }[];
  unitPlans?: any[];
  masterPlan?: {
    image?: string;
    title?: string;
    description?: string;
  };

  onCtaClick?: () => void;
}

export default function PropertyPlans_component(props: Props) {
  const {
    title,
    subtitle,
    tagline,
    floorPlans = [],
    unitPlans = [],
    masterPlan,
    onCtaClick,
  } = props;

  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const hasMaster = !!masterPlan?.image;
  const hasFloor = floorPlans.length > 0;
  const hasUnits = unitPlans.length > 0;

  if (!hasMaster && !hasFloor && !hasUnits) return null;

  return (
    <section
      id="plans"
      className="py-16 lg:py-20 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">

        {/* ---------- Header ---------- */}
        {(title || subtitle || tagline) && (
          <div className="max-w-3xl mx-auto text-center mb-12">
            {title && (
              <h2 className="text-3xl font-semibold mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground mb-3">
                {subtitle}
              </p>
            )}
            {tagline && (
              <p className="text-muted-foreground">
                {tagline}
              </p>
            )}
          </div>
        )}

        {/* ---------- Tabs ---------- */}
        <Tabs
          defaultValue={
            hasMaster ? "master" : hasFloor ? "floor" : "unit"
          }
          className="max-w-5xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-3 mb-10 h-auto bg-muted rounded-xl p-1">
            {hasMaster && (
              <TabsTrigger value="master">
                Master Plan
              </TabsTrigger>
            )}
            {hasFloor && (
              <TabsTrigger value="floor">
                Floor Plans
              </TabsTrigger>
            )}
            {hasUnits && (
              <TabsTrigger value="unit">
                Unit Plans
              </TabsTrigger>
            )}
          </TabsList>

          {/* ---------- MASTER PLAN ---------- */}
          {hasMaster && (
            <TabsContent value="master">
              <div className="flex justify-center">
                <MasterPlanBlock
                  image={masterPlan?.image}
                  title={masterPlan?.title}
                  description={masterPlan?.description}
                />
              </div>
            </TabsContent>
          )}

          {/* ---------- FLOOR PLANS ---------- */}
          {hasFloor && (
            <TabsContent value="floor">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center">
                {floorPlans.map((plan, i) => (
                  <FloorPlanCard
                    key={i}
                    {...plan}
                    onZoom={() => setZoomImage(plan.image)}
                  />
                ))}
              </div>
            </TabsContent>
          )}

          {/* ---------- UNIT PLANS ---------- */}
          {hasUnits && (
            <TabsContent value="unit">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center">
                {unitPlans.map((plan, i) => (
                  <UnitPlanCard
                    key={i}
                    {...plan}
                    onZoom={() =>
                      setZoomImage(plan.floorPlanImage)
                    }
                  />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* ---------- CTA (Decision Confirmation) ---------- */}
        {onCtaClick && (
          <div className="mt-14 flex justify-center">
            <CTAButtons
              onPrimaryClick={onCtaClick}
              intent={{
                source: "section",
                label: "Property Plans CTA",
              }}
            />
          </div>
        )}

      </div>

      {/* ---------- Global Zoom Modal ---------- */}
      <ImageZoomModal
        src={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </section>
  );
}
