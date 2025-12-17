// src/templates/common/Faq_component/components/FAQSearch.tsx
import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

interface FAQSearchProps {
  query: string;
  setQuery: (v: string) => void;
  suggestions: string[];
  projectSlug?: string;
  resultsCount: number;
}

export default function FAQSearch({
  query,
  setQuery,
  suggestions,
  projectSlug,
  resultsCount,
}: FAQSearchProps) {
  const debounceRef = useRef<number | null>(null);

  /* ---------------------------------------------
     Track search intent (debounced)
  ---------------------------------------------- */
  useEffect(() => {
    if (!query.trim()) return;

    // Debounce analytics (intent > typing)
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
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
    }, 400);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [query, resultsCount, projectSlug]);

  return (
    <div className="relative mt-6">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your question…"
        aria-label="Search frequently asked questions"
        className="
          w-full
          border border-border
          rounded-lg
          px-4 py-3
          text-base
          focus:outline-none
          focus:ring-2
          focus:ring-primary/40
        "
      />

      {/* Suggestions */}
      {query && suggestions.length > 0 && (
        <ul className="
          absolute z-10 mt-1 w-full
          bg-background border border-border
          rounded-lg shadow-lg
          max-h-60 overflow-auto
        ">
          {suggestions.slice(0, 5).map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setQuery(s)}
                className="
                  w-full text-left px-4 py-2
                  text-sm hover:bg-muted
                "
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
