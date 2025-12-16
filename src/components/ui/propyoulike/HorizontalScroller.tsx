// src/components/ui/propyoulike/HorizontalScroller.tsx

import React from "react";

export default function HorizontalScroller({ children }) {
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
