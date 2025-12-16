import { useState, useMemo } from "react";
import normalize from "../utils/normalize";

export function useFaqSearch(faqs: any[]) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return faqs;

    const q = normalize(query);
    return faqs.filter(
      f => normalize(f.question).includes(q) || normalize(f.answer).includes(q)
    );
  }, [faqs, query]);

  return { query, setQuery, filtered };
}
