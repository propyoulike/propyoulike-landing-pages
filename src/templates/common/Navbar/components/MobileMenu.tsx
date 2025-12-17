// src/templates/common/Navbar/components/MobileMenu.tsx

import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  menu: any[];
  activeId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export default function MobileMenu({
  open,
  menu,
  activeId,
  onSelect,
  onClose,
  ctaLabel,
  onCtaClick,
}: MobileMenuProps) {
  const [openSub, setOpenSub] = useState<string | null>(null);

  /* ---------------------------
     ESC to close (accessibility)
  ---------------------------- */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      {/* -------- Overlay -------- */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[9997] bg-black/50"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* -------- Drawer -------- */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`
          lg:hidden fixed inset-y-0 right-0 z-[9998]
          w-[280px] max-w-[85vw]
          bg-background shadow-2xl
          transition-transform duration-300
          motion-reduce:transition-none
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menu.map((m) => {
              const hasChildren = m.children?.length > 0;
              const expanded = openSub === m.id;

              return (
                <li key={m.id}>
                  <button
                    className={`
                      w-full flex items-center justify-between
                      px-4 py-3 rounded-xl text-left
                      ${activeId === m.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"}
                    `}
                    onClick={() => {
                      if (hasChildren) {
                        setOpenSub(expanded ? null : m.id);
                      } else {
                        onSelect(m.id);
                        onClose();
                      }
                    }}
                  >
                    <span>{m.label}</span>
                    {hasChildren && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {hasChildren && expanded && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {m.children.map((c) => (
                        <li key={c.id}>
                          <button
                            className="w-full px-4 py-2.5 text-sm rounded-lg
                              text-muted-foreground hover:bg-muted"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(c.id);
                              onClose();
                            }}
                          >
                            {c.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA */}
        {ctaLabel && onCtaClick && (
          <div className="p-4 border-t">
            <button
              className="w-full py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold"
              onClick={() => {
                onCtaClick();
                onClose();
              }}
            >
              {ctaLabel}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
