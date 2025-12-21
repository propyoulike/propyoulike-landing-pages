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

  /** Canonical section meta */
  meta?: SectionMeta | null;

  /** Construction updates */
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
  const [activeTower, setActiveTower] = useState<string>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /* ----------------------------------
     Tower list
  ---------------------------------- */
  const towers = useMemo(() => {
    const unique = Array.from(new Set(updates.map((u) => u.name)));
    return ["All", ...unique];
  }, [updates]);

  /* ----------------------------------
     Filter updates
  ---------------------------------- */
  const visibleUpdates = useMemo(() => {
    if (activeTower === "All") return updates;
    return updates.filter((u) => u.name === activeTower);
  }, [updates, activeTower]);

  const activeMedia =
    activeIndex !== null ? visibleUpdates[activeIndex] : null;

  const openMedia = useCallback((i: number) => {
    setActiveIndex(i);
  }, []);

  const closeMedia = useCallback(() => {
    setActiveIndex(null);
  }, []);

  if (!updates.length) return null;

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="lg"
    >
      {/* ─────────────────────────────
         TOWER SELECTOR (KEY UX)
      ───────────────────────────── */}
      {towers.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {towers.map((tower) => (
            <button
              key={tower}
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

      {/* ─────────────────────────────
         MEDIA CAROUSEL
      ───────────────────────────── */}
      {visibleUpdates.length > 0 ? (
        <MediaCarousel items={visibleUpdates}>
          {(item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_70%] lg:flex-[0_0_60%]"
            >
              <ConstructionTile
                tower={item}
                onClick={() => openMedia(i)}
              />
            </div>
          )}
        </MediaCarousel>
      ) : (
        <p className="text-center text-muted-foreground">
          No updates available for this tower.
        </p>
      )}

      {/* ─────────────────────────────
         MEDIA MODAL
      ───────────────────────────── */}
      <MediaModal
        open={!!activeMedia}
        media={activeMedia}
        onClose={closeMedia}
      />
    </BaseSection>
  );
});

export default Construction_component;
