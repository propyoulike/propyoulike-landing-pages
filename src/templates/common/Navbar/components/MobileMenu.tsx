// src/templates/common/Navbar/components/MobileMenu.tsx
import { X, ChevronDown } from "lucide-react";

export default function MobileMenu({
  open,
  menu,
  activeId,
  onSelect,
  onClose,
  ctaLabel,
  onCtaClick,
}) {
  return (
    <>
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[9997]"
          onClick={onClose}
        />
      )}

      <aside
        className={`lg:hidden fixed inset-y-0 right-0 w-[280px] max-w-[85vw] bg-background z-[9998]
          shadow-2xl transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold">Menu</span>
          <button onClick={onClose} className="p-2">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menu.map((m) => (
              <li key={m.id}>
                <button
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl
                    ${activeId === m.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}
                  `}
                  onClick={() => {
                    onSelect(m.id);
                    onClose();
                  }}
                >
                  {m.label}
                  {m.children?.length > 0 && <ChevronDown />}
                </button>

                {m.children?.length > 0 && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {m.children.map((c) => (
                      <li key={c.id}>
                        <button
                          className="w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted rounded-lg"
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
            ))}
          </ul>
        </nav>

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
