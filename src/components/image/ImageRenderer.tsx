//src/components/media/ImageRenderer.tsx
interface ImageRendererProps {
  src: string;
  alt?: string;
  rounded?: boolean;
  onClick?: () => void;
}

export default function ImageRenderer({ src, alt = "", rounded = true }) {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`w-full h-full object-cover ${rounded ? "rounded-2xl" : ""}`}
    />
  );
}
