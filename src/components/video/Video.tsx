import YouTubePlayer from "@/components/video/YouTubePlayer";

export default function Video({ videoId }: { videoId: string }) {
  return (
    <YouTubePlayer
      videoId={videoId}
      mode="click"
      rounded
      privacyMode
    />
  );
}
