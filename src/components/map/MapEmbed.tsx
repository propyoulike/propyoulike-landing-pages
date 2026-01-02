interface MapEmbedProps {
  url?: string;
  rounded?: boolean;
  title?: string;
}

export default function MapEmbed({
  url,
  rounded = true,
  title = "Project location map",
}: MapEmbedProps) {
  if (!url) return null;

  return (
    <iframe
      src={url}
      title={title}
      className={`w-full h-full ${rounded ? "rounded-2xl" : ""}`}
      loading="lazy"
      allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-popups"
      referrerPolicy="no-referrer"
      style={{ aspectRatio: "16 / 9" }}
    />
  );
}
