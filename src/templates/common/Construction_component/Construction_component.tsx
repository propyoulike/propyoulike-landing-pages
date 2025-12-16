import { memo, useState, useCallback } from "react";
import CTAButtons from "@/components/CTAButtons";
import MediaModal from "@/components/media/MediaModal";
import MediaCarousel from "@/components/media/MediaCarousel";
import ConstructionTile from "./ConstructionTile";

const Construction_component = memo(function Construction_component({
  id = "construction",
  title = "Construction Progress",
  subtitle = "Stay updated with the work happening on-site.",
  updates = [],
  onCtaClick,
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeMedia = activeIndex !== null ? updates[activeIndex] : null;

  const openMedia = useCallback((i) => setActiveIndex(i), []);
  const closeMedia = useCallback(() => setActiveIndex(null), []);

  return (
    <section id={id} className="py-20 lg:py-28 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <MediaCarousel items={updates}>
          {(tower, i) => (
            <div
              key={i}
              className="flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_70%] lg:flex-[0_0_60%]"
            >
              <ConstructionTile tower={tower} onClick={() => openMedia(i)} />
            </div>
          )}
        </MediaCarousel>

      </div>

      <MediaModal open={!!activeMedia} media={activeMedia} onClose={closeMedia} />

      {/* ------------ CTA (Global Component) ------------ */}
      {onCtaClick && (
        <div className="container max-w-4xl mt-10">
          <CTAButtons onPrimaryClick={onCtaClick} />
        </div>
      )}
    </section>
  );
});

export default Construction_component;
