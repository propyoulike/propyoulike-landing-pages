// src/templates/common/Faq_component/hooks/useFaqCategories.ts
import { useMemo } from "react";
import type { ResolvedFaqItem } from "../faqTypes";

export function useFaqCategories(faqs: ResolvedFaqItem[] = []) {
  return useMemo(() => {
    if (!Array.isArray(faqs) || faqs.length === 0) return [];

    const map = new Map<string, number>();

    faqs.forEach((faq) => {
      // category is already normalized in faqLoader
      map.set(faq.category, (map.get(faq.category) ?? 0) + 1);
    });

    return [
      { name: "All", count: faqs.length },
      ...Array.from(map.entries()).map(([name, count]) => ({
        name,
        count,
      })),
    ];
  }, [faqs]);
}
