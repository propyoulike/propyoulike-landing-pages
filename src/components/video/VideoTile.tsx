import AspectVideo from "./AspectVideo";

interface VideoTileProps {
  videoId: string;
  title?: string;
}

export default function VideoTile({
  videoId,
  title,
}: VideoTileProps) {
  return (
    <div className="w-full">
      <AspectVideo videoId={videoId} title={title} />
    </div>
  );
}
