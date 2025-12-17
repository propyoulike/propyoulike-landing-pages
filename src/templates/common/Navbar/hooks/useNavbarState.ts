// src/templates/common/Navbar/hooks/useNavbarState.ts
import { useEffect, useRef, useState } from "react";

export function useNavbarState() {
  const [sticky, setSticky] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastOverflow = useRef<string>("");

  /* -------------------------------------------
     Sticky + Shrink (RAF throttled)
  -------------------------------------------- */
  useEffect(() => {
    const hero = document.getElementById("hero");

    // If no hero, navbar should always be sticky
    if (!hero) {
      setSticky(true);
      setShrink(true);
      return;
    }

    const update = () => {
      rafRef.current = null;
      const rect = hero.getBoundingClientRect();

      setSticky(rect.bottom <= 0);
      setShrink(rect.bottom <= -48);
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    // Initial sync
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* -------------------------------------------
     ESC closes mobile drawer
  -------------------------------------------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* -------------------------------------------
     Body scroll lock (safe)
  -------------------------------------------- */
  useEffect(() => {
    if (mobileOpen) {
      lastOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = lastOverflow.current;
    }
  }, [mobileOpen]);

  return {
    sticky,
    shrink,
    mobileOpen,
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
    toggleMobile: () => setMobileOpen((s) => !s),
  };
}
