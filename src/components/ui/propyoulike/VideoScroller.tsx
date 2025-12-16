// src/components/ui/propyoulike/VideoScroller.tsx

export default function VideoScroller({ items, renderItem }) {
  return (
    <>
      {/* MOBILE SCROLL */}
      <div className="md:hidden flex gap-6 overflow-x-auto snap-x snap-mandatory px-4">
        {items.map((it, i) => (
          <div key={i} className="snap-start min-w-[85%]">
            {renderItem(it)}
          </div>
        ))}
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 container">
        {items.map((it, i) => (
          <div key={i}>
            {renderItem(it)}
          </div>
        ))}
      </div>
    </>
  );
}
