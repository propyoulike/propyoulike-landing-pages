// src/templates/common/Construction_component/ConstructionTile.tsx
import MediaTile from "@/components/media/MediaTile";
import { Building2, Play } from "lucide-react";

export default function ConstructionTile({ tower, onClick }) {
  const isVideo = !!tower.videoId;

  return (
    <button
      onClick={onClick}
      className="w-full text-left group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
        <MediaTile
          src={tower.image}
          youtubeId={tower.videoId}
          aspect="16:9"
          rounded
          clickable={false}
        />

        {/* Custom play button UI for video */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary shadow-2xl flex items-center justify-center opacity-90 group-hover:scale-110 transition">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        )}

        {/* Bottom label */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-white/90" />
            <span className="text-white font-semibold text-sm">
              {tower.name}
            </span>
          </div>
          <span className="text-xs text-white/80 hidden sm:inline">Tap to view</span>
        </div>
      </div>
    </button>
  );
}
