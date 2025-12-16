// src/components/media/MediaTile.tsx

import AspectBox from "./AspectBox";
import YouTubePlayer from "@/components/video/YouTubePlayer";
import ImageRenderer from "@/components/image/ImageRenderer";
import PlayIconOverlay from "./PlayIconOverlay";

export interface MediaProps {
  src?: string;
  youtubeId?: string;
  title?: string;
  description?: string;
  aspect?: string;       // default ratio
  rounded?: boolean;
  clickable?: boolean;
}

export default function MediaTile({
  src,
  youtubeId,
  title,
  description,
  aspect = "16:9",
  rounded = true,
  clickable = false,
  onClick,
}: MediaProps & { onClick?: () => void }) {

  const isVideo = !!youtubeId;

  return (
    <div
      className={`space-y-2 ${clickable ? "cursor-pointer" : ""}`}
      onClick={clickable ? onClick : undefined}
    >
      <AspectBox ratio={aspect}>
        <div
          className={`relative w-full h-full overflow-hidden ${
            rounded ? "rounded-2xl" : ""
          }`}
        >
          {/* VIDEO */}
          {isVideo ? (
            <>
              <YouTubePlayer videoId={youtubeId!} rounded={rounded} />
              <PlayIconOverlay />
            </>
          ) : (
            /* IMAGE */
            <ImageRenderer src={src!} rounded={rounded} />
          )}
        </div>
      </AspectBox>

      {/* Title + Description */}
      {title && <p className="text-sm font-medium">{title}</p>}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
