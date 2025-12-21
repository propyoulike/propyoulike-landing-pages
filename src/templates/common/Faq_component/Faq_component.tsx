// src/templates/common/Faq_component/Faq_component.tsx

import { memo, useState } from "react";
import CTAButtons from "@/components/CTAButtons";

import FAQSearch from "./components/FAQSearch";
import FAQCategories from "./components/FAQCategories";
import FAQList from "./components/FAQList";

import { useFaqSearch } from "./hooks/useFaqSearch";
import { useFaqCategories } from "./hooks/useFaqCategories";
import { useFaqSuggestions } from "./hooks/useFaqSuggestions";
import { useFaqPopularity } from "./hooks/useFaqPopularity";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface FaqProps {
  id?: string;

  /** Canonical section meta */
  meta?: SectionMeta | null;

  faqs?: any[];
  onCtaClick?: () => void;
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
function Faq_component({
  id = "faq",

  meta = {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    subtitle:
      "Clear answers to common questions buyers usually have",
    tagline:
      "If something isn’t clear, you can always speak to an expert",
  },

  faqs = [],
  onCtaClick,
}: FaqProps) {
  /** Normalize input */
  const safeFaqs = Array.isArray(faqs) ? faqs : [];

  /** State */
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<string | null>(null);
  const [lastClickedQuestion, setLastClickedQuestion] =
    useState<string | null>(null);

  /** Hooks (must be unconditional) */
  const { query, setQuery, filtered } =
    useFaqSearch(safeFaqs);
  const categories = useFaqCategories(safeFaqs);
  const suggestions = useFaqSuggestions(query, safeFaqs);
  const popular = useFaqPopularity(safeFaqs);

  /** Early exit */
  if (!safeFaqs.length) return null;

  const hasQuery = query.trim().length > 0;

  const categoryFilteredFaqs = activeCategory
    ? safeFaqs.filter(
        (f) => f.category === activeCategory
      )
    : safeFaqs;

  const baseFaqs = hasQuery
    ? filtered
    : categoryFilteredFaqs;

  const defaultFaqs = popular.length
    ? popular
    : safeFaqs;

  const visibleFaqs = showAll
    ? baseFaqs
    : defaultFaqs.slice(0, 3);

  /* ---------------- WhatsApp CTA ---------------- */
  const handleWhatsappCTA = () => {
    const text = lastClickedQuestion
      ? `Hi, I have a question about this project:\n\n"${lastClickedQuestion}"`
      : `Hi, I’d like to know more about this project.`;

    const url = `https://wa.me/919379822010?text=${encodeURIComponent(
      text
    )}`;

    window.open(url, "_blank");
  };

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      {/* ─────────────────────────────
         SEARCH
      ───────────────────────────── */}
      <FAQSearch
        query={query}
        setQuery={setQuery}
        suggestions={suggestions}
        resultsCount={baseFaqs.length}
      />

      {/* ─────────────────────────────
         CATEGORIES (ONLY WHEN EXPANDED)
      ───────────────────────────── */}
      {showAll && (
        <FAQCategories
          categories={categories}
          onSelectCategory={(cat) => {
            setActiveCategory(
              cat === "All" ? null : cat
            );
            setShowAll(true);
          }}
        />
      )}

      {/* ─────────────────────────────
         FAQ LIST
      ───────────────────────────── */}
      <FAQList
        faqs={visibleFaqs}
        autoExpandFirst={!showAll && !hasQuery}
        onFaqClick={(q) =>
          setLastClickedQuestion(q)
        }
        onInlineCTA={handleWhatsappCTA}
      />

      {/* ─────────────────────────────
         SHOW ALL
      ───────────────────────────── */}
      {!showAll &&
        !hasQuery &&
        safeFaqs.length > 5 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="text-primary text-sm underline"
            >
              View all {safeFaqs.length} questions →
            </button>
          </div>
        )}

      {/* ─────────────────────────────
         FINAL CTA
      ───────────────────────────── */}
      <div className="mt-14 text-center border-t pt-8">
        <p className="text-muted-foreground mb-4">
          Still unsure? Talk to someone who knows this
          project.
        </p>

        {onCtaClick && (
          <CTAButtons
            onPrimaryClick={handleWhatsappCTA}
          />
        )}
      </div>
    </BaseSection>
  );
}

export default memo(Faq_component);
