// src/hooks/useTrustReviewed.ts
import { useEffect, useState } from "react";

export function useTrustReviewed(sectionId = "trust-and-clarity") {
  const [trustReviewed, setTrustReviewed] = useState(false);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrustReviewed(true);
          observer.disconnect(); // fire once
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [sectionId]);

  return trustReviewed;
}
