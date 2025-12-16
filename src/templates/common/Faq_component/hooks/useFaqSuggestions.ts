import { useMemo } from "react";
import normalize from "../utils/normalize";

export function useFaqSuggestions(query: string = "", faqs: any[] = []) {
  return useMemo(() => {
    if (!query || !query.trim()) return [];

    const q = normalize(query);

    return faqs
      .filter(f => normalize(f.question).includes(q))
      .slice(0, 5)
      .map(f => f.question);
  }, [query, faqs]);
}
