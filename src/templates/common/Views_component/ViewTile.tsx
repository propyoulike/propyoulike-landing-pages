import MediaTile from "@/components/media/MediaTile";

interface ViewTileProps {
  src: string;
  title?: string;
  onClick?: () => void;
  onSpotlightMove?: (e: React.MouseEvent) => void;
}

export default function ViewTile({
  src,
  title,
  onClick,
  onSpotlightMove,
}: ViewTileProps) {
  const isDesktop =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  return (
    <div
      role="button"
      aria-label="Open image in full screen"
      className={`
        relative rounded-3xl overflow-hidden cursor-pointer group
        transition-all duration-500
        ${isDesktop ? "hover:-translate-y-2 hover:shadow-2xl" : ""}
      `}
      onClick={onClick}
      onMouseMove={isDesktop ? onSpotlightMove : undefined}
    >
      <MediaTile
        src={src}
        alt={title || "Project view"}
        aspect="16:9"
        rounded
        showMeta={false}
      />

      {/* Title overlay */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 pointer-events-none">
          <p className="text-white font-semibold text-lg drop-shadow-xl">
            {title}
          </p>
        </div>
      )}

      {/* Mobile tap affordance */}
      {!isDesktop && (
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
          Tap to view
        </div>
      )}
    </div>
  );
}
