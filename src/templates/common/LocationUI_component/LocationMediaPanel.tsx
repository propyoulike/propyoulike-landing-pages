import MediaTile from "@/components/media/MediaTile";
import MapEmbed from "@/components/map/MapEmbed";

export default function LocationMediaPanel({ videoId, mapUrl }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      
      <MediaTile
        youtubeId={videoId}
        aspect="16:9"
        rounded
      />

      <div className="rounded-2xl overflow-hidden shadow-xl">
        <MapEmbed url={mapUrl} />
      </div>

    </div>
  );
}
