import type { ResolvedFaqItem } from "./faqTypes";

export function buildFaqSchema(faqs: ResolvedFaqItem[], url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": url,
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };
}
