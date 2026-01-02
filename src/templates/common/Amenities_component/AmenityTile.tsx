// src/templates/common/Amenities_component/AmenityTile.tsx

import { memo } from "react";
import MediaTile from "@/components/media/MediaTile";

interface AmenityTileProps {
  src?: string;
  youtubeId?: string;
  title: string;
  description?: string;
  onSpotlightMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: () => void;
}

const AmenityTile = memo(function AmenityTile({
  src,
  title,
  description,
  youtubeId,
  onSpotlightMove,
  onClick,
}: AmenityTileProps) {
  return (
    <article
      className="
        relative group rounded-3xl overflow-hidden
        cursor-pointer select-none
        focus-within:ring-2 focus-within:ring-primary/60
      "
      onMouseMove={onSpotlightMove}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
    >
      {/* MEDIA (SAFE) */}
      <MediaTile
        src={src}
        youtubeId={youtubeId}
        alt={title}
        aspect="4:3"
        rounded
        showMeta={false}
      />

      {/* GRADIENT OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />

      {/* TEXT */}
      <div className="pointer-events-none absolute bottom-6 left-0 w-full px-6 text-center">
        <h4 className="text-white text-2xl font-extrabold drop-shadow-xl">
          {title}
        </h4>

        {description && (
          <p className="mt-2 text-sm text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100">
            {description}
          </p>
        )}
      </div>
    </article>
  );
});

export default AmenityTile;
