import type { ResolvedFaqItem } from "./faqTypes";

/* ---------------------------------------------
   Helpers
---------------------------------------------- */

const stripHtml = (text: string) =>
  text.replace(/<[^>]*>/g, "").trim();

/* ---------------------------------------------
   FAQ Schema Builder
---------------------------------------------- */

export function buildFaqSchema(
  faqs: ResolvedFaqItem[],
  url: string,
  maxItems = 8 // ⭐ SEO-safe default
) {
  if (!faqs.length) return null;

  const entities = faqs
    .slice(0, maxItems)
    .map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(f.answer),
      },
    }));

  if (!entities.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": url,
    mainEntity: entities,
  };
}
