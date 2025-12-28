import YouTubePlayer from "./YouTubePlayer";

export default function AspectVideo({
  videoId,
  title,
}: {
  videoId: string;
  title?: string;
}) {
  if (!videoId) return null;

  return (
    <div className="space-y-2">
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
        <YouTubePlayer videoId={videoId} rounded={false} />
      </div>

      {title && (
        <p className="text-sm font-medium text-foreground">
          {title}
        </p>
      )}
    </div>
  );
}
