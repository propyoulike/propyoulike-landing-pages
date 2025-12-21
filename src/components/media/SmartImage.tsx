import React from "react";
import { proxyImage } from "@/lib/media/imageProxy";

interface SmartImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  w?: number;
  h?: number;
  q?: number;
}

export default function SmartImage({
  src,
  w,
  h,
  q,
  alt = "",
  ...rest
}: SmartImageProps) {
  if (!src) return null;

  const safeSrc = proxyImage(src, { w, h, q });

  return (
    <img
      src={safeSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;

        // prevent infinite loop
        if (!img.dataset.fallback) {
          img.dataset.fallback = "true";
          img.src = "/images/placeholder.svg";
        }
      }}
      {...rest}
    />
  );
}
