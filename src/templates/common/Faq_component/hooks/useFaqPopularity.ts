import { useMemo } from "react";

export function useFaqPopularity(faqs: any[] = []) {
  return useMemo(() => {
    if (!Array.isArray(faqs) || faqs.length === 0) return [];

    return [...faqs] // ✅ clone before sort
      .filter(f => f && typeof f.popularity === "number")
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
  }, [faqs]);
}
