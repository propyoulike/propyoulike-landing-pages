// src/templates/common/Navbar/hooks/useScrollSpy.ts
import { useEffect, useRef, useState } from "react";

type Section = {
  id: string;
  top: number;
};

export function useScrollSpy(
  ids: string[],
  lockRef: React.RefObject<boolean>
) {
  const [activeId, setActiveId] = useState("");
  const sectionsRef = useRef<Section[]>([]);
  const rafRef = useRef<number | null>(null);

  /* -------------------------------
     Measure sections
  -------------------------------- */
  useEffect(() => {
    if (!ids.length) return;

    const measure = () => {
      const navbar = document.querySelector("header");
      const offset = (navbar?.clientHeight || 0) + 20;

      sectionsRef.current = ids
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;

          const rect = el.getBoundingClientRect();
          const scrollTop = window.scrollY;

          return {
            id,
            top: rect.top + scrollTop - offset,
          };
        })
        .filter(Boolean) as Section[];
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [ids]);

  /* -------------------------------
     Scroll spy
  -------------------------------- */
  useEffect(() => {
    if (!sectionsRef.current.length) return;

    const onScroll = () => {
      if (lockRef.current) return; // 🔒 critical
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        const y = window.scrollY;
        let current = sectionsRef.current[0]?.id ?? "";

        for (const s of sectionsRef.current) {
          if (y >= s.top) current = s.id;
          else break;
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
  }, [ids]);

  return activeId;
}
