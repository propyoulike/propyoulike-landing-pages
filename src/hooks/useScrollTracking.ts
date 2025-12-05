import { useEffect, useState } from "react";

export function useScrollTracking() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
}

export function trackCTAClick(name: string) {
  console.log("CTA Click Tracked:", name);
}

export function trackWhatsAppClick() {
  console.log("WhatsApp CTA clicked");
}
