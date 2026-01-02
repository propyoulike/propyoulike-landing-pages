// src/templates/common/Construction_component/ConstructionTile.tsx

import MediaTile from "@/components/media/MediaTile";
import { Building2, Play } from "lucide-react";

interface ConstructionUpdate {
  name: string;
  image: string;
  videoId?: string;
}

interface ConstructionTileProps {
  update: ConstructionUpdate;
  onClick: () => void;
}

/**
 * ConstructionTile
 * --------------------------------------------------
 * GUARANTEES:
 * - Semantic button (a11y correct)
 * - CLS-safe layout
 * - Media click isolation
 * - Keyboard & screen-reader friendly
 */
export default function ConstructionTile({
  update,
  onClick,
}: ConstructionTileProps) {
  const isVideo = Boolean(update.videoId);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open construction update: ${update.name}`}
      className="
        w-full text-left group
        rounded-2xl cursor-pointer
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
      "
    >
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
        {/* 🔒 MEDIA CLICK ISOLATION */}
        <div
          className="absolute inset-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MediaTile
            src={update.image}
            youtubeId={update.videoId}
            aspect="16:9"
            rounded
            clickable={false}
          />
        </div>

        {/* ▶ Play Overlay */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="
              w-16 h-16 rounded-full bg-primary
              shadow-2xl flex items-center justify-center
              opacity-90 group-hover:scale-110 transition
            ">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        )}

        {/* 🏗 Footer Label */}
        <div className="
          absolute bottom-0 inset-x-0
          bg-gradient-to-t from-black/70
          px-4 py-3 flex items-center gap-2
        ">
          <Building2 className="w-4 h-4 text-white/90" />
          <span className="text-white font-semibold text-sm">
            {update.name}
          </span>
        </div>
      </div>
    </button>
  );
}
