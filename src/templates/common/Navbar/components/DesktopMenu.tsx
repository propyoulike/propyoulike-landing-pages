// src/templates/common/Navbar/components/DesktopMenu.tsx
import { useState } from "react";
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
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="hidden lg:flex items-center gap-1">
      {menu.map((m) => {
        const hasChildren = !!m.children?.length;

        const isChildActive =
          hasChildren && m.children!.some((c) => c.id === activeId);

        const isActive = activeId === m.id || isChildActive;
        const isOpen = openId === m.id;

        return (
          <li
            key={m.id}
            className="relative"
            onMouseLeave={() => setOpenId(null)}
          >
            {/* ---------------- Parent ---------------- */}
            <button
              type="button"
              aria-haspopup={hasChildren ? "menu" : undefined}
              aria-expanded={hasChildren ? isOpen : undefined}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors
                ${
                  isActive
                    ? "text-primary bg-primary/5"
                    : "text-foreground/80 hover:bg-muted"
                }
              `}
              onClick={() => {
                if (hasChildren) {
                  setOpenId(isOpen ? null : m.id);
                } else {
                  onSelect(m.id);
                }
              }}
              onKeyDown={(e) => {
                if (!hasChildren) return;

                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenId(isOpen ? null : m.id);
                }

                if (e.key === "Escape") {
                  setOpenId(null);
                }
              }}
            >
              {m.label}
              {hasChildren && (
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* ---------------- Dropdown ---------------- */}
            {hasChildren && (
              <div
                role="menu"
                className={`
                  absolute left-0 mt-1 min-w-[12rem]
                  bg-card border border-border
                  rounded-xl shadow-lg
                  transition
                  ${
                    isOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible pointer-events-none"
                  }
                `}
              >
                <ul className="py-2">
                  {m.children!.map((c) => {
                    const childActive = activeId === c.id;

                    return (
                      <li key={c.id} role="menuitem">
                        <button
                          className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition
                            ${
                              childActive
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }
                          `}
                          onClick={() => {
                            onSelect(c.id);
                            setOpenId(null);
                          }}
                        >
                          {c.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
