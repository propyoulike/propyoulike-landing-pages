// src/templates/common/Amenities_component/AmenityTile.tsx

import MediaTile from "@/components/media/MediaTile";

export default function AmenityTile({
  src,
  title,
  description,
  youtubeId,
  onSpotlightMove,
  onClick,
}) {
  return (
    <div
      className="relative group rounded-3xl overflow-hidden cursor-pointer"
      onMouseMove={onSpotlightMove}
      onClick={onClick}
    >
      <MediaTile
        src={src}
        youtubeId={youtubeId}
        alt={title}
        aspect="4:3"
        rounded
        showMeta={false}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70 pointer-events-none" />

      {/* Text overlay */}
      <div className="absolute bottom-6 left-0 w-full text-center px-6 pointer-events-none">
        <h4 className="text-white text-2xl font-extrabold drop-shadow-xl">
          {title}
        </h4>

        {description && (
          <p className="text-white/90 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
