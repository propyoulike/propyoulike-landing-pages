// src/templates/common/Construction_component/Construction_component.tsx

import { memo, useState, useMemo, useCallback } from "react";
import MediaCarousel from "@/components/media/MediaCarousel";
import MediaModal from "@/components/media/MediaModal";
import ConstructionTile from "./ConstructionTile";
import { cn } from "@/lib/utils";

interface ConstructionUpdate {
  name: string;        // Tower 4G
  image: string;
  type?: "image" | "video";
  videoId?: string;
}

interface Props {
  id?: string;
  title?: string;
  subtitle?: string;
  tagline?: string;
  updates: ConstructionUpdate[];
}

const Construction_component = memo(function Construction_component({
  id = "construction",
  title,
  subtitle,
  tagline,
  updates = [],
}: Props) {
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
    <section id={id} className="py-20 lg:py-28 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4">

        {/* ---------- Header ---------- */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {title && (
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
          {tagline && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              {tagline}
            </p>
          )}
        </div>

        {/* ---------- Tower Selector (KEY UX) ---------- */}
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

        {/* ---------- Media Carousel ---------- */}
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
      </div>

      {/* ---------- Modal ---------- */}
      <MediaModal
        open={!!activeMedia}
        media={activeMedia}
        onClose={closeMedia}
      />
    </section>
  );
});

export default Construction_component;
