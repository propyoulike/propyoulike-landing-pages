// src/templates/common/Faq_component/Faq_component.tsx

import { memo, useState, useMemo } from "react";
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
   TYPES (SCHEMA-ALIGNED)
------------------------------------------------------------------------*/
export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
  popularity?: number;
}

interface FaqProps {
  id?: string;
  meta?: SectionMeta;
  faqs?: FaqItem[];
  onCtaClick?: () => void;
  whatsappNumber?: string;
}

/* ---------------------------------------------------------------------
   ENV GUARD
------------------------------------------------------------------------*/
const isBrowser = typeof window !== "undefined";

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

  faqs,
  onCtaClick,
  whatsappNumber = "919379822010",
}: FaqProps) {
  /* ------------------------------------------------------------
     DEV SAFETY GUARD (FAIL LOUD)
  ------------------------------------------------------------ */
  if (import.meta.env.DEV && faqs && !Array.isArray(faqs)) {
    throw new Error(
      "[Faq_component] `faqs` must be an array of FAQ items"
    );
  }

  /* ------------------------------------------------------------
     Normalization (STABLE, SIDE-EFFECT FREE)
  ------------------------------------------------------------ */
  const safeFaqs = useMemo<FaqItem[]>(() => {
    return Array.isArray(faqs) ? faqs : [];
  }, [faqs]);

  /* ------------------------------------------------------------
     UI STATE (MUST RUN ALWAYS)
  ------------------------------------------------------------ */
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<string | null>(null);
  const [lastClickedQuestion, setLastClickedQuestion] =
    useState<string | null>(null);

  /* ------------------------------------------------------------
     DERIVED DATA (HOOKS MUST BE UNCONDITIONAL)
  ------------------------------------------------------------ */
  const { query, setQuery, filtered } =
    useFaqSearch(safeFaqs);

  const categories =
    useFaqCategories(safeFaqs);

  const suggestions =
    useFaqSuggestions(query, safeFaqs);

  const popular =
    useFaqPopularity(safeFaqs);

  /* ------------------------------------------------------------
     NOW IT IS SAFE TO GUARD
  ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     WhatsApp CTA (GUARDED)
  ------------------------------------------------------------ */
  const handleWhatsappCTA = () => {
    if (!isBrowser) return;

    if (onCtaClick) {
      onCtaClick();
      return;
    }

    const text = lastClickedQuestion
      ? `Hi, I have a question about this project:\n\n"${lastClickedQuestion}"`
      : `Hi, I’d like to know more about this project.`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        text
      )}`,
      "_blank"
    );
  };

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
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
            setActiveCategory(
              cat === "All" ? null : cat
            );
            setShowAll(true);
          }}
        />
      )}

      <FAQList
        faqs={visibleFaqs}
        autoExpandFirst={!showAll && !hasQuery}
        onFaqClick={setLastClickedQuestion}
        onInlineCTA={handleWhatsappCTA}
      />

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

      <div className="mt-14 text-center border-t pt-8">
        <p className="text-muted-foreground mb-4">
          Still unsure? Talk to someone who knows this
          project.
        </p>

        <CTAButtons
          onPrimaryClick={handleWhatsappCTA}
        />
      </div>
    </BaseSection>
  );
}

export default memo(Faq_component);
