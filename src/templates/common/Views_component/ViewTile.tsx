// src/templates/common/Views_component/ViewTile.tsx

import MediaTile from "@/components/media/MediaTile";

export default function ViewTile({
  src,
  title,
  onClick,
  onSpotlightMove,
}) {
  return (
    <div
      className="
        relative rounded-3xl overflow-hidden cursor-pointer 
        group hover:-translate-y-2 hover:shadow-2xl transition-all duration-700
      "
      onClick={onClick}
      onMouseMove={onSpotlightMove}
    >
      <MediaTile
        src={src}
        alt={title || "Project View"}
        aspect="16:9"
        rounded
        showMeta={false}
      />

      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 pointer-events-none">
          <p className="text-white font-semibold text-lg drop-shadow-xl">
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
