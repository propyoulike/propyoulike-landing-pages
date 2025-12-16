// src/components/image/ImageZoomModal.tsx

import { useEffect } from "react";

interface ImageZoomModalProps {
  src: string | null;
  onClose: () => void;
}

export default function ImageZoomModal({ src, onClose }: ImageZoomModalProps) {
  // ESC closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!src) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center">
      {/* Background dismiss zone */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Close button */}
      <button
        className="absolute top-5 right-5 text-4xl text-white z-[1000]"
        onClick={onClose}
      >
        ×
      </button>

      {/* Zoomed Image */}
      <div className="max-w-[95%] max-h-[95%] rounded-xl overflow-hidden z-[1000]">
        <img src={src} className="object-contain w-full h-full" />
      </div>
    </div>
  );
}
