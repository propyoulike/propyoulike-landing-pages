// src/templates/common/PropertyPlans_component/PropertyPlans_component.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

import ImageZoomModal from "@/components/image/ImageZoomModal";
import MasterPlanBlock from "./MasterPlanBlock";
import FloorPlanCard from "./FloorPlanCard";
import UnitPlanCard from "./UnitPlanCard";
import CTAButtons from "@/components/CTAButtons";

import SectionHeader from "../SectionHeader";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface Props {
  id?: string;

  /** Canonical section meta */
  meta?: SectionMeta;

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

  onCtaClick?: () => void;
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function PropertyPlans_component({
  id = "plans",

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

  onCtaClick,
}: Props) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const hasMaster = Boolean(masterPlan?.image);
  const hasFloor = floorPlans.length > 0;
  const hasUnits = unitPlans.length > 0;

  if (!hasMaster && !hasFloor && !hasUnits) return null;

  return (
    <section
      id={id}
      className="py-12 md:py-16 scroll-mt-32 bg-background"
    >
      <div className="container max-w-6xl">

        {/* ─────────────────────────────
           SECTION HEADER (SYSTEMIC)
        ───────────────────────────── */}
        <div className="mb-12">
          <SectionHeader
            eyebrow={meta.eyebrow}
            title={meta.title}
            subtitle={meta.subtitle}
            tagline={meta.tagline}
            align="center"
          />
        </div>

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
              <TabsTrigger value="master">
                Master plan
              </TabsTrigger>
            )}
            {hasFloor && (
              <TabsTrigger value="floor">
                Floor plans
              </TabsTrigger>
            )}
            {hasUnits && (
              <TabsTrigger value="unit">
                Unit plans
              </TabsTrigger>
            )}
          </TabsList>

          {/* MASTER PLAN */}
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

          {/* FLOOR PLANS */}
          {hasFloor && (
            <TabsContent value="floor">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center">
                {floorPlans.map((plan, i) => (
                  <FloorPlanCard
                    key={i}
                    {...plan}
                    onZoom={() =>
                      plan.image &&
                      setZoomImage(plan.image)
                    }
                  />
                ))}
              </div>
            </TabsContent>
          )}

          {/* UNIT PLANS */}
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

        {/* ─────────────────────────────
           CTA — DECISION CONFIRMATION
        ───────────────────────────── */}
        {onCtaClick && (
          <div className="mt-16 flex justify-center">
            <CTAButtons
              onPrimaryClick={onCtaClick}
              intent={{
                source: "section",
                label: "property_plans_viewed",
              }}
            />
          </div>
        )}
      </div>

      {/* ─────────────────────────────
           GLOBAL ZOOM MODAL
        ───────────────────────────── */}
      <ImageZoomModal
        src={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </section>
  );
}
