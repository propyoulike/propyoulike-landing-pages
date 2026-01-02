import MediaTile from "@/components/media/MediaTile";
import MapEmbed from "@/components/map/MapEmbed";

export default function LocationMediaPanel({
  videoId,
  mapUrl,
}: {
  videoId?: string;
  mapUrl?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">

      {/* ---------- Video (height locked via aspect) ---------- */}
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
        <MediaTile
          youtubeId={videoId}
          aspect="16:9"
          rounded
        />
      </div>

      {/* ---------- Map (HEIGHT MUST BE RESERVED) ---------- */}
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-muted">
        {mapUrl ? (
          <MapEmbed url={mapUrl} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            Map loading…
          </div>
        )}
      </div>

    </div>
  );
}
