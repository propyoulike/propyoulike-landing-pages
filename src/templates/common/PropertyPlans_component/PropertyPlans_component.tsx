// src/templates/common/PropertyPlans_component/PropertyPlans_component.tsx

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ImageZoomModal from "@/components/image/ImageZoomModal";
import MasterPlanBlock from "./MasterPlanBlock";
import FloorPlanCard from "./FloorPlanCard";
import UnitPlanCard from "./UnitPlanCard";
import CTAButtons from "@/components/CTAButtons";

import VideoScroller from "@/components/ui/propyoulike/VideoScroller";
import VideoTile from "@/components/video/VideoTile";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface PropertyPlansProps {
  id?: string;
  meta?: SectionMeta | null;

  floorPlans?: {
    title?: string;
    image?: string;
    description?: string;
  }[];

  unitPlans?: any[];

  masterPlan?: {
    image?: string;
    title?: string;
    description?: string;
  };

  modelFlats?: {
    youtubeId?: string;
    title?: string;
    order?: number;
  }[];

  onCtaClick?: () => void;
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function PropertyPlans_component({
  id = "propertyPlans",

  meta = {
    eyebrow: "LAYOUTS",
    title: "Property plans & layouts",
    subtitle:
      "Explore master plans, floor layouts, and unit configurations",
    tagline:
      "Designed for comfort, efficiency, and long-term value",
  },

  floorPlans = [],
  unitPlans = [],
  masterPlan,
  modelFlats = [],

  onCtaClick,
}: PropertyPlansProps) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const hasMaster = Boolean(masterPlan?.image);
  const hasFloor = floorPlans.length > 0;
  const hasUnits = unitPlans.length > 0;
  const hasModelFlats = modelFlats.length > 0;

  const hasContent =
    hasMaster || hasFloor || hasUnits || hasModelFlats;

  if (!hasContent) return null;

  const normalizedModelFlats = modelFlats
    .filter((f) => typeof f.youtubeId === "string")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <BaseSection id={id} meta={meta} align="center" padding="md">
      {/* ─────────────────────────────
         MODEL FLAT WALKTHROUGHS
      ───────────────────────────── */}
      {hasModelFlats && (
        <div className="mt-20 max-w-6xl mx-auto">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Model Flat Walkthroughs
          </p>

          <VideoScroller>
            {normalizedModelFlats.map((flat) => (
              <div key={flat.youtubeId} className="aspect-video">
                <VideoTile
                  videoId={flat.youtubeId!}
                  title={flat.title}
                />
              </div>
            ))}
          </VideoScroller>
        </div>
      )}

      {/* ─────────────────────────────
         TABS
      ───────────────────────────── */}
      <Tabs
        defaultValue={
          hasMaster ? "master" : hasFloor ? "floor" : "unit"
        }
        className="max-w-5xl mx-auto"
      >
        <TabsList className="grid w-full grid-cols-3 mb-10 bg-muted rounded-xl p-1">
          {hasMaster && (
            <TabsTrigger value="master">Master plan</TabsTrigger>
          )}
          {hasFloor && (
            <TabsTrigger value="floor">Floor plans</TabsTrigger>
          )}
          {hasUnits && (
            <TabsTrigger value="unit">Unit plans</TabsTrigger>
          )}
        </TabsList>

        {hasMaster && (
          <TabsContent value="master">
            <MasterPlanBlock {...masterPlan} />
          </TabsContent>
        )}

        {hasFloor && (
          <TabsContent value="floor">
            <div className="grid md:grid-cols-2 gap-10">
              {floorPlans.map((plan, i) => (
                <FloorPlanCard
                  key={i}
                  {...plan}
                  onZoom={() =>
                    plan.image && setZoomImage(plan.image)
                  }
                />
              ))}
            </div>
          </TabsContent>
        )}

        {hasUnits && (
          <TabsContent value="unit">
            <div className="grid md:grid-cols-2 gap-10">
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

      {/* ─────────────────────────────
         CTA
      ───────────────────────────── */}
      {onCtaClick && (
        <div className="mt-16 flex justify-center">
          <CTAButtons onPrimaryClick={onCtaClick} />
        </div>
      )}

      <ImageZoomModal
        src={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </BaseSection>
  );
}
