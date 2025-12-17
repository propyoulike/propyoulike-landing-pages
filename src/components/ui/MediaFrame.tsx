// src/components/ui/MediaFrame.tsx
type MediaFrameProps = {
  ratio?: "16/9" | "4/3" | "1/1";
  children: React.ReactNode;
};

export default function MediaFrame({
  ratio = "16/9",
  children,
}: MediaFrameProps) {
  const ratioClass =
    ratio === "16/9"
      ? "aspect-video"
      : ratio === "4/3"
      ? "aspect-[4/3]"
      : "aspect-square";

  return (
    <div className={`overflow-hidden rounded-xl ${ratioClass}`}>
      {children}
    </div>
  );
}
