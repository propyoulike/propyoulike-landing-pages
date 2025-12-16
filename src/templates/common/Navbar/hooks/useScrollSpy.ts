// src/templates/common/Navbar/hooks/useScrollSpy.ts
import { useEffect, useState } from "react";

export function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!ids.length) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const navbar = document.querySelector("header");
        const offset = (navbar?.clientHeight || 0) + 20;

        let current = "";

        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;

          const rect = el.getBoundingClientRect();
          const top = rect.top - offset;
          const bottom = rect.bottom - offset;

          // Section is covering the navbar threshold
          if (top <= 0 && bottom > 0) {
            current = id;
            break;
          }
        }

        setActiveId(current);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial

    return () => window.removeEventListener("scroll", handleScroll);
  }, [ids]);

  return activeId;
}
