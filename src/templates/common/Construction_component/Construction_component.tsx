// src/templates/common/Construction_component/Construction_component.tsx

/**
 * ============================================================
 * Construction Section
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Displays construction progress media (images / videos)
 * - Allows filtering by tower / phase
 * - Provides modal media viewing
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * - Pure render from props
 * - No project identity access
 * - No routing or global state
 * - Hydration-safe
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. SCHEMA-ALIGNED
 *    Props represent authoring intent, not UI accidents
 *
 * 2. UI STATE ISOLATION
 *    Filtering and modal state never corrupt each other
 *
 * 3. DEFENSIVE RENDERING
 *    No assumptions about list stability
 *
 * ============================================================
 */

import { memo, useState, useMemo, useCallback } from "react";

import MediaCarousel from "@/components/media/MediaCarousel";
import MediaModal from "@/components/media/MediaModal";
import ConstructionTile from "./ConstructionTile";
import { cn } from "@/lib/utils";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES (SCHEMA-ALIGNED)
------------------------------------------------------------------------*/
interface ConstructionUpdate {
  /** Tower / phase label (UI grouping key) */
  tower: string;

  /** Image preview URL */
  image: string;

  /** Media type (defaults to image) */
  type?: "image" | "video";

  /** Optional YouTube video id */
  videoId?: string;
}

interface ConstructionProps {
  /** Section anchor id */
  id?: string;

  /** Canonical section meta */
  meta?: SectionMeta;

  /** Construction progress updates */
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
  /* ------------------------------------------------------------
     DEV SAFETY GUARD (FAIL LOUD)
     ------------------------------------------------------------
     - Catches resolver / wiring bugs immediately
     - Stripped from production builds
  ------------------------------------------------------------ */
  if (import.meta.env.DEV && !Array.isArray(updates)) {
    throw new Error(
      "[Construction_component] `updates` must be an array of ConstructionUpdate"
    );
  }

  /* ------------------------------------------------------------
     Guard — no content
  ------------------------------------------------------------ */
  if (!updates.length) return null;

  /* ------------------------------------------------------------
     UI STATE
  ------------------------------------------------------------ */
  const [activeTower, setActiveTower] = useState<string>("All");
  const [activeMedia, setActiveMedia] =
    useState<ConstructionUpdate | null>(null);

  /* ------------------------------------------------------------
     Tower list (UI grouping)
  ------------------------------------------------------------ */
  const towers = useMemo(() => {
    const unique = Array.from(
      new Set(updates.map((u) => u.name))
    );
    return ["All", ...unique];
  }, [updates]);

  /* ------------------------------------------------------------
     Filtered updates
  ------------------------------------------------------------ */
  const visibleUpdates = useMemo(() => {
    if (activeTower === "All") return updates;
    return updates.filter(
      (u) => u.tower === activeTower
    );
  }, [updates, activeTower]);

  /* ------------------------------------------------------------
     Event handlers
  ------------------------------------------------------------ */
  const openMedia = useCallback(
    (item: ConstructionUpdate) => {
      setActiveMedia(item);
    },
    []
  );

  const closeMedia = useCallback(() => {
    setActiveMedia(null);
  }, []);

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="lg"
    >
      {/* ─────────────────────────────
         TOWER SELECTOR
      ───────────────────────────── */}
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

      {/* ─────────────────────────────
         MEDIA CAROUSEL
      ───────────────────────────── */}
      {visibleUpdates.length > 0 ? (
        <MediaCarousel items={visibleUpdates}>
          {(item) => (
            <div
              key={`${item.tower}-${item.image}`}
              className="flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_70%] lg:flex-[0_0_60%]"
            >
              <ConstructionTile
                tower={item}
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
