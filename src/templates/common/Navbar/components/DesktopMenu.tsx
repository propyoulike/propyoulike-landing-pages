// src/templates/common/Navbar/components/DesktopMenu.tsx
import { ChevronDown } from "lucide-react";

export default function DesktopMenu({ menu, activeId, onSelect }) {
  return (
    <ul className="hidden lg:flex items-center gap-1">
      {menu.map((m) => (
        <li key={m.id} className="relative group">
          {!m.children?.length ? (
            <button
              className={`px-3 py-2 text-sm rounded-lg transition-colors
                ${activeId === m.id ? "text-primary bg-primary/5" : "text-foreground/80 hover:bg-muted"}
              `}
              onClick={() => onSelect(m.id)}
            >
              {m.label}
            </button>
          ) : (
            <>
              <button
                onClick={() => onSelect(m.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg 
                  ${activeId === m.id ? "text-primary bg-primary/5" : "text-foreground/80 hover:bg-muted"}
                `}
              >
                {m.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {/* DROPDOWN */}
              <div className="absolute left-0 mt-1 min-w-[12rem] bg-card border border-border 
                              rounded-xl shadow-lg hidden group-hover:block">
                <ul className="py-2">
                  {m.children.map((c) => (
                    <li key={c.id}>
                      <button
                        className="w-full text-left px-4 py-2.5 hover:bg-muted text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(c.id);
                        }}
                      >
                        {c.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
