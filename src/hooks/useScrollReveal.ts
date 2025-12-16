import { useEffect } from "react";

export function useScrollReveal(selector = ".fade-up", threshold = 0.15) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, threshold]);
}
