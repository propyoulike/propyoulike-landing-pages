import YouTubePlayer from "@/components/video/YouTubePlayer";

export default function TestimonialVideoPlayer({
  videoId,
  onExit,
}: {
  videoId: string;
  onExit?: () => void;
}) {
  if (!videoId) return null;

  return (
    <YouTubePlayer
      videoId={videoId}
      mode="click"
      autoPlay
      className="w-full h-full"
      onExit={onExit}
    />
  );
}
