/**
 * ============================================================
 * FloatingQuickNav (FINAL)
 *
 * Mobile-only floating quick navigation for long project pages
 * ------------------------------------------------------------
 * - Post-render DOM discovery
 * - Scroll-spy with RAF throttling
 * - Hidden near footer & when Lead CTA is open
 * - Understated visual language (NOT a CTA)
 * ============================================================
 */

import { memo, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { buildFloatingNavItems } from "@/utils/buildFloatingNav";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";

/* -------------------------------------------------
   Types
-------------------------------------------------- */
type NavItem = {
  id: string;    // section DOM id
  label: string; // human-readable label
};

/* -------------------------------------------------
   Component
-------------------------------------------------- */
function FloatingQuickNav() {
  /* -------------------------------
     State
  -------------------------------- */
  const [items, setItems] = useState<NavItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState("");

  /* CTA state (single source of truth) */
  const { isCTAOpen } = useLeadCTAContext();

  /* -------------------------------
     Refs
  -------------------------------- */
  const footerVisibleRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  /* =================================================
     1️⃣ Discover sections (once after mount)
  ================================================= */
  useEffect(() => {
    const discovered = buildFloatingNavItems();

    /* ✅ HARD CAP — mobile readability */
    setItems(discovered.slice(0, 6));
  }, []);

  /* =================================================
     2️⃣ Footer visibility observer
  ================================================= */
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

  /* =================================================
     3️⃣ Scroll logic (RAF throttled)
  ================================================= */
  useEffect(() => {
    if (!items.length) return;

    const onScroll = () => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        /* Hide near footer */
        if (footerVisibleRef.current) {
          setVisible(false);
          return;
        }

        /* Show shortly after hero */
        setVisible(window.scrollY > window.innerHeight * 0.35);

        /* Account for fixed header */
        const navbar = document.querySelector("header");
        const offset = (navbar?.clientHeight || 0) + 16;

        let current = "";

        for (const item of items) {
          const el = document.getElementById(item.id);
          if (!el) continue;

          const rect = el.getBoundingClientRect();

          if (
            rect.top - offset <= 0 &&
            rect.bottom - offset > 0
          ) {
            current = item.id;
            break;
          }
        }

        setActiveId(current);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial sync

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [items]);

  /* =================================================
     HARD GUARD — DO NOT RENDER WHEN:
     - CTA is open
     - Not visible
     - No items
  ================================================= */
  if (!visible || !items.length || isCTAOpen) {
    return null;
  }

  /* =================================================
     Scroll helper
  ================================================= */
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const navbar = document.querySelector("header");
    const offset = navbar ? navbar.clientHeight + 12 : 80;

    const top =
      el.getBoundingClientRect().top +
      window.scrollY -
      offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  /* =================================================
     Render (mobile only)
  ================================================= */
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[9998] lg:hidden"
style={{
  bottom: footerVisibleRef.current
    ? "calc(env(safe-area-inset-bottom, 6px) + 16px)"
    : "env(safe-area-inset-bottom, 6px)",
}}
    >
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/90 backdrop-blur-md border shadow-md">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
  className={cn(
    "flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border transition-all",
    footerVisibleRef.current
      ? "bg-background/80 shadow-sm"
      : "bg-background/95 shadow-md"
  )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------
   Export
-------------------------------------------------- */
export default memo(FloatingQuickNav);
