// src/templates/common/Construction_component/Construction_component.tsx

import { memo, useState, useMemo, useCallback } from "react";

import MediaCarousel from "@/components/media/MediaCarousel";
import MediaModal from "@/components/media/MediaModal";
import ConstructionTile from "./ConstructionTile";
import { cn } from "@/lib/utils";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface ConstructionUpdate {
  name: string;
  image: string;
  type?: "image" | "video";
  videoId?: string;
}

interface ConstructionProps {
  id?: string;
  meta?: SectionMeta;
  updates?: ConstructionUpdate[];
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
const Construction_component = memo(function Construction_component({
  id = "construction",

  meta = {
    eyebrow: "PROGRESS",
    title: "Construction updates",
    subtitle:
      "Track the latest construction progress with photos and videos",
    tagline:
      "Updated regularly to reflect on-site progress",
  },

  updates = [],
}: ConstructionProps) {
  if (import.meta.env.DEV && !Array.isArray(updates)) {
    throw new Error(
      "[Construction_component] `updates` must be an array"
    );
  }

  if (!updates.length) return null;

  const [activeTower, setActiveTower] = useState<string>("All");
  const [activeMedia, setActiveMedia] =
    useState<ConstructionUpdate | null>(null);

  /* Tower list */
  const towers = useMemo(() => {
    const unique = Array.from(
      new Set(updates.map((u) => u.name))
    );
    return ["All", ...unique];
  }, [updates]);

  /* Filter */
  const visibleUpdates = useMemo(() => {
    if (activeTower === "All") return updates;
    return updates.filter(
      (u) => u.name === activeTower
    );
  }, [updates, activeTower]);

  const openMedia = useCallback((item: ConstructionUpdate) => {
    setActiveMedia(item);
  }, []);

  const closeMedia = useCallback(() => {
    setActiveMedia(null);
  }, []);

  return (
    <BaseSection id={id} meta={meta} align="center" padding="lg">
      {/* Filters */}
      {towers.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {towers.map((tower) => (
            <button
              key={`tower-${tower}`}
              onClick={() => setActiveTower(tower)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeTower === tower
                  ? "bg-primary text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              )}
            >
              {tower}
            </button>
          ))}
        </div>
      )}

      {/* Carousel */}
      {visibleUpdates.length > 0 ? (
        <MediaCarousel items={visibleUpdates}>
          {(item) => (
            <div
              key={item.image}
              className="flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_70%] lg:flex-[0_0_60%]"
            >
              <ConstructionTile
                update={item}
                onClick={() => openMedia(item)}
              />
            </div>
          )}
        </MediaCarousel>
      ) : (
        <p className="text-center text-muted-foreground">
          No updates available for this selection.
        </p>
      )}

      <MediaModal
        open={!!activeMedia}
        media={activeMedia}
        onClose={closeMedia}
      />
    </BaseSection>
  );
});

export default Construction_component;
