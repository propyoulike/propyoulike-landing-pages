// src/templates/common/FloatingQuickNav.tsx
import { memo, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { buildFloatingNavItems } from "@/utils/buildFloatingNav";

type NavItem = {
  id: string;
  label: string;
};

function FloatingQuickNav() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState("");

  const footerVisibleRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  /* -------------------------------------------------
     Detect sections once (after mount)
  -------------------------------------------------- */
  useEffect(() => {
    setItems(buildFloatingNavItems());
  }, []);

  /* -------------------------------------------------
     Footer observer (prevents overlap)
  -------------------------------------------------- */
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        footerVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  /* -------------------------------------------------
     Scroll logic (RAF throttled)
  -------------------------------------------------- */
  useEffect(() => {
    if (!items.length) return;

    const onScroll = () => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        // Hide near footer
        if (footerVisibleRef.current) {
          setVisible(false);
          return;
        }

        setVisible(window.scrollY > window.innerHeight * 0.6);

        const navbar = document.querySelector("header");
        const offset = (navbar?.clientHeight || 0) + 20;

        let current = "";

        for (const item of items) {
          const el = document.getElementById(item.id);
          if (!el) continue;

          const rect = el.getBoundingClientRect();
          if (rect.top - offset <= 0 && rect.bottom - offset > 0) {
            current = item.id;
            break;
          }
        }

        setActiveId(current);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [items]);

  if (!visible || !items.length) return null;

  /* -------------------------------------------------
     Scroll handler
  -------------------------------------------------- */
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const navbar = document.querySelector("header");
    const offset = navbar ? navbar.clientHeight + 12 : 80;

    const top =
      el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 z-[9998] lg:hidden">
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-background/90 backdrop-blur-md border shadow-lg">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full transition-all",
              activeId === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(FloatingQuickNav);
