// src/templates/common/Navbar/hooks/useScrollTo.ts
import { RefObject } from "react";

const OFFSET_PADDING = 20;
const SCROLL_RELEASE_MS = 500;

export function useScrollTo(lockRef: RefObject<boolean>) {
  return function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const navbar = document.querySelector("header");
    const offset = (navbar?.clientHeight || 0) + OFFSET_PADDING;

    const top =
      el.getBoundingClientRect().top + window.scrollY - offset;

    // lock scroll spy
    lockRef.current = true;

    window.scrollTo({
      top,
      behavior: "smooth",
    });

    // unlock after scroll settles
    window.setTimeout(() => {
      lockRef.current = false;
    }, SCROLL_RELEASE_MS);

    if (location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }
  };
}
