// src/templates/common/Navbar/components/DesktopMenu.tsx
import { ChevronDown } from "lucide-react";

/* -------------------------------------------------
   Types
-------------------------------------------------- */
export interface DesktopMenuItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

interface DesktopMenuProps {
  menu: DesktopMenuItem[];
  activeId?: string | null;
  onSelect: (id: string) => void;
}

/* -------------------------------------------------
   Component
-------------------------------------------------- */
export default function DesktopMenu({
  menu,
  activeId,
  onSelect,
}: DesktopMenuProps) {
  return (
    <ul className="hidden lg:flex items-center gap-1">
      {menu.map((m) => {
        const isActive = activeId === m.id;

        return (
          <li key={m.id} className="relative group">
            {/* ---------- Simple link ---------- */}
            {!m.children?.length ? (
              <button
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-2 text-sm rounded-lg transition-colors
                  ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-foreground/80 hover:bg-muted"
                  }
                `}
                onClick={() => onSelect(m.id)}
              >
                {m.label}
              </button>
            ) : (
              <>
                {/* ---------- Parent with dropdown ---------- */}
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={false}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg 
                    ${
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-foreground/80 hover:bg-muted"
                    }
                  `}
                >
                  {m.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {/* ---------- Dropdown ---------- */}
                <div
                  role="menu"
                  className="
                    absolute left-0 mt-1 min-w-[12rem]
                    bg-card border border-border
                    rounded-xl shadow-lg
                    opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible
                    transition
                  "
                >
                  <ul className="py-2">
                    {m.children.map((c) => (
                      <li key={c.id} role="menuitem">
                        <button
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted"
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
        );
      })}
    </ul>
  );
}
