// src/templates/common/FloatingQuickNav.tsx

/**
 * ============================================================
 * FloatingQuickNav
 *
 * PURPOSE
 * ------------------------------------------------------------
 * - Provide a compact, mobile-only quick navigation bar
 * - Reflect currently visible section (scroll spy)
 * - Allow fast jumping between major sections
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. DATALESS COMPONENT
 *    - Does NOT depend on project, type, or builder
 *    - Reads DOM state only (rendered sections)
 *
 * 2. POST-RENDER DISCOVERY
 *    - Nav items are derived AFTER React renders sections
 *    - Prevents coupling to config or templates
 *
 * 3. PERFORMANCE SAFE
 *    - Scroll handling is requestAnimationFrame-throttled
 *    - Passive listeners
 *
 * 4. NON-INTRUSIVE UX
 *    - Hidden near footer to avoid overlap
 *    - Hidden when Lead CTA is open
 *    - Hidden on desktop (lg+)
 *
 * 5. FAIL-SAFE
 *    - If no sections or no visibility → renders nothing
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
  /* -------------------------------------------------
     State
  -------------------------------------------------- */
  const [items, setItems] = useState<NavItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState("");

  // ✅ CTA state (single source of truth)
  const { isCTAOpen } = useLeadCTAContext();

  /* -------------------------------------------------
     Refs (non-reactive state)
  -------------------------------------------------- */
  const footerVisibleRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  /* =================================================
     1️⃣ Discover sections (ONCE after mount)
  ================================================== */
  useEffect(() => {
    setItems(buildFloatingNavItems());
  }, []);

  /* =================================================
     2️⃣ Footer observer
  ================================================== */
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
  ================================================== */
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

        /* Show after user scrolls past hero */
        setVisible(window.scrollY > window.innerHeight * 0.6);

        /* Account for fixed header height */
        const navbar = document.querySelector("header");
        const offset = (navbar?.clientHeight || 0) + 20;

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
     ✅ HARD GUARD — THIS IS THE FIX
     - Hide when CTA is open
     - Hide when not visible
     - Hide when no sections
  ================================================== */
  if (!visible || !items.length || isCTAOpen) {
    return null;
  }

  /* =================================================
     Scroll helper
  ================================================== */
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
  ================================================== */
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

/* -------------------------------------------------
   Memoized export
-------------------------------------------------- */
export default memo(FloatingQuickNav);
