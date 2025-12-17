import { useEffect, useState, memo } from "react";
import { getMergedFaqs } from "./faqLoader";
import type { ResolvedFaqItem } from "./faqTypes";

import FAQHeader from "./components/FAQHeader";
import FAQSearch from "./components/FAQSearch";
import FAQCategories from "./components/FAQCategories";
import FAQList from "./FAQList";

import { useFaqSearch } from "./hooks/useFaqSearch";
import { useFaqCategories } from "./hooks/useFaqCategories";
import { useFaqPopularity } from "./hooks/useFaqPopularity";

interface FaqSectionProps {
  builder: string;
  projectId: string;
}

function FaqSection({ builder, projectId }: FaqSectionProps) {
  const [faqs, setFaqs] = useState<ResolvedFaqItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /* ---------------------------------------------
     Load FAQs
  ---------------------------------------------- */
  useEffect(() => {
    if (!builder || !projectId) return;

    getMergedFaqs(builder, projectId).then(setFaqs);
  }, [builder, projectId]);

  if (!faqs.length) return null;

  /* ---------------------------------------------
     Search + derived state
  ---------------------------------------------- */
  const { query, setQuery, filtered } = useFaqSearch(faqs);
  const categories = useFaqCategories(faqs);
  const popular = useFaqPopularity(faqs);

  const hasQuery = query.trim().length > 0;

  const categoryFiltered = activeCategory
    ? faqs.filter((f) => f.category === activeCategory)
    : faqs;

  const visibleFaqs = hasQuery
    ? filtered
    : activeCategory
    ? categoryFiltered
    : popular.length
    ? popular
    : faqs.slice(0, 5);

  return (
    <section
      id="faq"
      className="py-20 scroll-mt-32 bg-background"
    >
      <div className="container max-w-3xl mx-auto px-4">

        {/* Header */}
        <FAQHeader
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before booking a site visit"
        />

        {/* Search */}
        <FAQSearch
          query={query}
          setQuery={setQuery}
          suggestions={popular.map((f) => f.question)}
          projectSlug={projectId}
          resultsCount={visibleFaqs.length}
        />

        {/* Categories (only when not searching) */}
        {!hasQuery && categories.length > 0 && (
          <FAQCategories
            categories={categories}
            onSelectCategory={(cat) => setActiveCategory(cat)}
          />
        )}

        {/* Clear category */}
        {activeCategory && !hasQuery && (
          <div className="mt-3">
            <button
              className="text-sm text-muted-foreground underline"
              onClick={() => setActiveCategory(null)}
            >
              Clear category filter
            </button>
          </div>
        )}

        {/* FAQ List */}
        <FAQList
          faqs={visibleFaqs}
          autoExpandFirst={!hasQuery && !activeCategory}
        />

      </div>
    </section>
  );
}

export default memo(FaqSection);
