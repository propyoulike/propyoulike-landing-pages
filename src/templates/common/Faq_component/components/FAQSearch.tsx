// src/templates/common/Faq_component/components/FAQSearch.tsx
import { useEffect } from "react";
import { track } from "@/lib/track";

export default function FAQSearch({
  query,
  setQuery,
  suggestions,
  projectSlug,
  resultsCount,
}: {
  query: string;
  setQuery: (v: string) => void;
  suggestions: string[];
  projectSlug?: string;
  resultsCount: number;
}) {
  useEffect(() => {
    if (!query.trim()) return;

    track("faq_search", {
      project: projectSlug,
      query,
      resultsCount,
    });

    if (resultsCount === 0) {
      track("faq_search_no_results", {
        project: projectSlug,
        query,
      });
    }
  }, [query]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search your question…"
      className="w-full border rounded-lg px-4 py-3"
    />
  );
}
