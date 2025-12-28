// src/components/media/VideoScroller.tsx

/**
 * ============================================================
 * VideoScroller
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Layout-only horizontal video scroller
 * - Renders children ONLY
 *
 * GUARANTEES
 * ------------------------------------------------------------
 * - No iframe logic
 * - No YouTube knowledge
 * - No data normalization
 *
 * ============================================================
 */

import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function VideoScroller({ children }: Props) {
  if (!children) return null;

  return (
    <div
      className="
        flex gap-6 overflow-x-auto snap-x snap-mandatory
        py-2 px-1
        [-webkit-overflow-scrolling:touch]
        [&::-webkit-scrollbar]:hidden
        scrollbar-hide
      "
    >
      {React.Children.map(children, (child, idx) => (
        <div key={idx} className="snap-start shrink-0 w-[85%]">
          {child}
        </div>
      ))}
    </div>
  );
}
