// src/components/video/VideoTile.tsx

import AspectVideo from "./AspectVideo";

interface VideoTileProps {
  videoId: string;
  title?: string;
}

export default function VideoTile({ videoId, title }) {
  return (
    <div className="w-full">
      <AspectVideo videoId={videoId} title={title} />
    </div>
  );
}
