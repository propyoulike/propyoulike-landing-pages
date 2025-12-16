export default function MapEmbed({ url, rounded = true }) {
  if (!url) return null;

  return (
    <iframe
      src={url}
      className={`w-full h-full ${rounded ? "rounded-2xl" : ""}`}
      loading="lazy"
      allowFullScreen
    />
  );
}
