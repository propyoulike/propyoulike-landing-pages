//src/templates/common/PropertyPlans_component/PropertyPlans_component.tsx

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

  modelFlats?: { title?: string; youtubeId?: string }[];
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
    modelFlats = [],
    floorPlans = [],
    unitPlans = [],
    masterPlan,
    onCtaClick
  } = props;

  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const hasMaster = !!masterPlan?.image;
  const hasFloor = floorPlans.length > 0;
  const hasUnits = unitPlans.length > 0;

  if (!hasMaster && !hasFloor && !hasUnits) return null;

  return (
    <section className="py-20 lg:py-28 scroll-mt-32 bg-background" id="plans">
      <div className="container mx-auto px-4">

        {/* ---------- Header ---------- */}
        {(title || subtitle || tagline) && (
          <div className="max-w-3xl mx-auto text-center mb-12">
            {title && (
              <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground mb-4">
                {subtitle}
              </p>
            )}
            {tagline && (
              <p className="text-muted-foreground">{tagline}</p>
            )}
          </div>
        )}

        {/* ---------- Main Tabs ---------- */}
        <Tabs
          defaultValue={
            hasMaster ? "master" : hasFloor ? "floor" : "unit"
          }
          className="max-w-5xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-3 mb-10 h-auto bg-gray-50 rounded-xl p-1">
            {hasMaster && (
              <TabsTrigger value="master">Master Plan</TabsTrigger>
            )}
            {hasFloor && (
              <TabsTrigger value="floor">Floor Plans</TabsTrigger>
            )}
            {hasUnits && (
              <TabsTrigger value="unit">Unit Plans</TabsTrigger>
            )}
          </TabsList>

          {/* ---------- MASTER PLAN ---------- */}
          {hasMaster && (
            <TabsContent value="master">
              <MasterPlanBlock
                image={masterPlan?.image}
                title={masterPlan?.title}
                description={masterPlan?.description}
              />
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
                    onZoom={() => setZoomImage(plan.floorPlanImage)}
                    onCta={onCtaClick}
                  />
                ))}
              </div>
            </TabsContent>
          )}

        </Tabs>
      </div>

      {/* ---------- Global Zoom Modal ---------- */}
      <ImageZoomModal src={zoomImage} onClose={() => setZoomImage(null)} />

      {/* ------------ CTA (Global Component) ------------ */}
      {onCtaClick && (
        <div className="container max-w-4xl mt-10">
          <CTAButtons onPrimaryClick={onCtaClick} />
        </div>
      )}

    </section>
  );
}
