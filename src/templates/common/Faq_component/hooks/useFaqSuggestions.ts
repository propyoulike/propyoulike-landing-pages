import { useMemo } from "react";
import normalize from "@/lib/text/normalize";

export function useFaqSuggestions(
  query: string = "",
  faqs: any[] = []
) {
  return useMemo(() => {
    if (!query.trim()) return [];
    if (!Array.isArray(faqs)) return [];

    const q = normalize(query);
    const seen = new Set<string>();

    return faqs
      .filter((f) => {
        if (!f?.question) return false;
        return normalize(f.question).includes(q);
      })
      .map((f) => f.question)
      .filter((q) => {
        if (seen.has(q)) return false;
        seen.add(q);
        return true;
      })
      .slice(0, 5);
  }, [query, faqs]);
}
