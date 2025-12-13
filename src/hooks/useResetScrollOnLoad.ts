import { useEffect } from "react";

export function useResetScrollOnLoad() {
  useEffect(() => {
    // disable browser auto-restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // scroll to top AFTER browser attempts restoration
    requestAnimationFrame(() => window.scrollTo(0, 0));

    // scroll again after images / iframes settle
    const t = setTimeout(() => window.scrollTo(0, 0), 120);

    return () => clearTimeout(t);
  }, []);
}
