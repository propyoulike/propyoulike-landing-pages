import { useMemo } from "react";

export function useFaqPopularity(faqs: any[] = []) {
  return useMemo(() => {
    // Hard guard: if faqs is not an array, return empty
    if (!Array.isArray(faqs)) return [];

    return faqs
      .filter(f => f && typeof f.popularity === "number")
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
  }, [faqs]);
}
