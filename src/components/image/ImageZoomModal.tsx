// src/components/image/ImageZoomModal.tsx

import { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { X } from "lucide-react";

interface ImageZoomModalProps {
  src: string | null;
  onClose: () => void;
}

export default function ImageZoomModal({
  src,
  onClose,
}: ImageZoomModalProps) {
  const isOpen = Boolean(src);

  /* -------------------------------
     Prevent background scroll
  -------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  /* -------------------------------
     ESC to close (desktop)
  -------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 rounded-full bg-black/70 p-2 text-white hover:bg-black"
        aria-label="Close image"
      >
        <X size={20} />
      </button>

      <ZoomableImage src={src!} onClose={onClose} />
    </div>
  );
}

/* =========================================================
   Zoomable Image (isolated for clarity)
========================================================= */

function ZoomableImage({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  const startY = useRef<number | null>(null);
  const [scale, setScale] = useState(1);

  return (
    <TransformWrapper
      minScale={1}
      maxScale={4}
      initialScale={1}
      centerOnInit
      wheel={{ step: 0.15 }}
      pinch={{ step: 5 }}
      doubleClick={{ disabled: true }}
      panning={{ velocityDisabled: true }}
      onZoomStop={({ state }) => setScale(state.scale)}
      onPanningStop={({ state }) => setScale(state.scale)}
    >
      <TransformComponent
        wrapperClass="w-full h-full flex items-center justify-center"
        contentClass="touch-none"
      >
        <img
          src={src}
          alt="Zoomed plan"
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}

          /* -------------------------------
             Swipe-down to close (SAFE)
          -------------------------------- */
          onTouchStart={(e) => {
            if (scale !== 1) return;
            startY.current = e.touches[0].clientY;
          }}
          onTouchMove={(e) => {
            if (scale !== 1 || startY.current === null) return;

            const deltaY = e.touches[0].clientY - startY.current;

            if (deltaY > 140) {
              startY.current = null;
              onClose();
            }
          }}
          onTouchEnd={() => {
            startY.current = null;
          }}
        />
      </TransformComponent>
    </TransformWrapper>
  );
}
