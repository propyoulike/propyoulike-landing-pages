// src/templates/common/Construction_component/TowerFilter.tsx

import { memo } from "react";

interface Props {
  towers: string[];
  active: string;
  onChange: (tower: string) => void;
}

const TowerFilter = memo(function TowerFilter({
  towers,
  active,
  onChange,
}: Props) {
  if (!towers.length) return null;

  return (
    <div
      className="
        flex gap-3 overflow-x-auto pb-2 mb-6
        scrollbar-hide
        min-h-[44px]
      "
      role="tablist"
      aria-label="Tower filter"
    >
      {towers.map((tower) => {
        const isActive = active === tower;

        return (
          <button
            key={tower}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-pressed={isActive}
            onClick={() => onChange(tower)}
            className={[
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive
                ? "bg-primary text-white shadow"
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            ].join(" ")}
          >
            {tower}
          </button>
        );
      })}
    </div>
  );
});

export default TowerFilter;
