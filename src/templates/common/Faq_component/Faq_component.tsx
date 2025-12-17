import { memo, useState } from "react";
import CTAButtons from "@/components/CTAButtons";

import FAQHeader from "./components/FAQHeader";
import FAQSearch from "./components/FAQSearch";
import FAQCategories from "./components/FAQCategories";
import FAQList from "./components/FAQList";

import { useFaqSearch } from "./hooks/useFaqSearch";
import { useFaqCategories } from "./hooks/useFaqCategories";
import { useFaqSuggestions } from "./hooks/useFaqSuggestions";
import { useFaqPopularity } from "./hooks/useFaqPopularity";

type FaqProps = {
  title?: string;
  subtitle?: string;
  faqs?: any[];
  onCtaClick?: () => void;
};

function Faq({ title, subtitle, faqs = [], onCtaClick }: FaqProps) {
  /** ✅ Always normalize first */
  const safeFaqs = Array.isArray(faqs) ? faqs : [];

  /** ✅ ALL hooks must run unconditionally */
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lastClickedQuestion, setLastClickedQuestion] = useState<string | null>(null);

  const { query, setQuery, filtered } = useFaqSearch(safeFaqs);
  const categories = useFaqCategories(safeFaqs);
  const suggestions = useFaqSuggestions(query, safeFaqs);
  const popular = useFaqPopularity(safeFaqs);

  /** ✅ AFTER hooks — safe early exit */
  if (!safeFaqs.length) return null;

  const hasQuery = query.trim().length > 0;

  const categoryFilteredFaqs = activeCategory
    ? safeFaqs.filter((f) => f.category === activeCategory)
    : safeFaqs;

  const baseFaqs = hasQuery ? filtered : categoryFilteredFaqs;
  const defaultFaqs = popular.length ? popular : safeFaqs;

  const visibleFaqs = showAll
    ? baseFaqs
    : defaultFaqs.slice(0, 3);

  const handleWhatsappCTA = () => {
    const text = lastClickedQuestion
      ? `Hi, I have a question about this project:\n\n"${lastClickedQuestion}"`
      : `Hi, I’d like to know more about this project.`;

    const url = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="faq" className="py-20">
      <FAQHeader title={title} subtitle={subtitle} />

      <FAQSearch
        query={query}
        setQuery={setQuery}
        suggestions={suggestions}
        resultsCount={baseFaqs.length}
      />

      {showAll && (
        <FAQCategories
          categories={categories}
          onSelectCategory={(cat) => {
            setActiveCategory(cat === "All" ? null : cat);
            setShowAll(true);
          }}
        />
      )}

      <FAQList
        faqs={visibleFaqs}
        autoExpandFirst={!showAll && !hasQuery}
        onFaqClick={(q) => setLastClickedQuestion(q)}
        onInlineCTA={handleWhatsappCTA}
      />

      {!showAll && !hasQuery && safeFaqs.length > 5 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-primary text-sm underline"
          >
            View all {safeFaqs.length} questions →
          </button>
        </div>
      )}

      <div className="mt-14 text-center border-t pt-8">
        <p className="text-muted-foreground mb-4">
          Still unsure? Talk to someone who knows this project.
        </p>

        {onCtaClick && <CTAButtons onPrimaryClick={handleWhatsappCTA} />}
      </div>
    </section>
  );
}

export default memo(Faq);
