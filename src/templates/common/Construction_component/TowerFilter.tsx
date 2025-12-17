// src/templates/common/Construction_component/TowerFilter.tsx

interface Props {
  towers: string[];
  active: string;
  onChange: (tower: string) => void;
}

export default function TowerFilter({ towers, active, onChange }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
      {["All", ...towers].map((tower) => {
        const isActive = active === tower;

        return (
          <button
            key={tower}
            onClick={() => onChange(tower)}
            className={[
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition",
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
}
