
// useFaqCategories.ts
import { useMemo } from "react";

export function useFaqCategories(faqs: any[]) {
  const map = new Map<string, number>();

  faqs.forEach(faq => {
    const name = faq.category ?? "General";
    map.set(name, (map.get(name) ?? 0) + 1);
  });

  return [
    { name: "All", count: faqs.length },
    ...Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    })),
  ];
}
