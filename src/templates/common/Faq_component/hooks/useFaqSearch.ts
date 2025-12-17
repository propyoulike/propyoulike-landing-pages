import { useState, useMemo } from "react";
import normalize from "@/lib/text/normalize";

export function useFaqSearch(faqs: any[] = []) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!Array.isArray(faqs)) return [];
    if (!query.trim()) return faqs;

    const q = normalize(query);

    return faqs.filter((f) => {
      if (!f) return false;

      const question = normalize(f.question ?? "");
      const answer = normalize(f.answer ?? "");

      return question.includes(q) || answer.includes(q);
    });
  }, [faqs, query]);

  return { query, setQuery, filtered };
}
