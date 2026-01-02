import AspectBox from "./AspectBox";
import YouTubePlayer from "@/components/video/YouTubePlayer";
import ImageRenderer from "@/components/image/ImageRenderer";

export interface MediaProps {
  src?: string;
  youtubeId?: string;
  title?: string;
  description?: string;
  aspect?: string;
  rounded?: boolean;
  clickable?: boolean;
  onClick?: () => void;
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
}: MediaProps) {
  const isVideo = Boolean(youtubeId);
  const isClickable = clickable && !isVideo;

  return (
    <div
      className={`space-y-2 ${isClickable ? "cursor-pointer" : ""}`}
      onClick={isClickable ? onClick : undefined}
    >
      <AspectBox ratio={aspect}>
        <div
          className={`relative w-full h-full overflow-hidden ${
            rounded ? "rounded-2xl" : ""
          }`}
        >
          {isVideo ? (
            <YouTubePlayer videoId={youtubeId!} rounded={rounded} />
          ) : src ? (
            <ImageRenderer src={src} rounded={rounded} />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
              Media coming soon
            </div>
          )}
        </div>
      </AspectBox>

      {title && <p className="text-sm font-medium">{title}</p>}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
