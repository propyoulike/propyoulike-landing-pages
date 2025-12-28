// src/lib/scrollReveal.ts

/**
 * ============================================================
 * scrollReveal
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Progressive enhancement utility
 * - Adds "show" class when elements enter viewport
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * - NOT a React hook
 * - Must be called ONLY inside useEffect
 * - Browser-only
 *
 * ============================================================
 */

export function scrollReveal(
  selector = ".fade-up",
  threshold = 0.15
) {
  if (typeof window === "undefined") return;

  const elements =
    document.querySelectorAll<HTMLElement>(selector);

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}
