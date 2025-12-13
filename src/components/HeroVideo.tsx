// src/component/HeroVideo.tsx

import { useEffect, useRef, useState } from "react";

export default function HeroVideo({ videoId }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loadIframe, setLoadIframe] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadIframe(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);

  const thumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div ref={ref} className="relative w-full h-[70vh] bg-black overflow-hidden">
      {!loadIframe && (
        <img src={thumb} alt="" className="w-full h-full object-cover opacity-70" />
      )}

      {loadIframe && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${videoId}`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay"
          loading="lazy"
        ></iframe>
      )}

      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
}
