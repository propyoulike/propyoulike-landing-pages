// src/hooks/useScrollReveal.ts

import { useEffect } from "react";

/**
 * ============================================================
 * useScrollReveal
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Progressive enhancement hook for scroll-based reveals
 * - Adds `.show` class when elements enter viewport
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * - Safe in SSR / prerender (no-op on server)
 * - Pure side-effect hook
 * - No conditional execution
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. SELF-CONTAINED
 *    → Owns its own useEffect
 *
 * 2. FAIL-SAFE
 *    → Does nothing if browser APIs unavailable
 *
 * 3. NON-BLOCKING
 *    → Never affects render outcome
 *
 * ============================================================
 */
export function useScrollReveal(
  selector: string = ".fade-up",
  threshold: number = 0.15
) {
  useEffect(() => {
    // 🔒 SSR / non-browser guard
    if (
      typeof window === "undefined" ||
      typeof document === "undefined" ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, threshold]);
}
