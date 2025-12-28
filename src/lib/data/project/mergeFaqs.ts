// src/lib/data/project/mergeFaqs.ts

import type { SectionMeta } from "@/content/types/sectionMeta";

interface MergeFaqsArgs {
  builder: string;
  projectSlug: string;
  hydrated: any;
  getJSON: (path: string) => any;
}

export function mergeFaqs({
  builder,
  projectSlug,
  hydrated,
  getJSON,
}: MergeFaqsArgs) {
  /* -------------------------------------------------
     Load FAQ sources (DATA ONLY)
  -------------------------------------------------- */
  const globalFaqs =
    getJSON("/src/content/global/faq.json")?.faqs ?? [];

  const builderFaqs =
    getJSON(
      `/src/content/builders/${builder}/builder_faq.json`
    )?.faqs ?? [];

  const projectFaqBlock =
    getJSON(
      `/src/content/projects/${builder}/${builder}-${projectSlug}.json`
    )?.faq ?? {};

  const projectFaqs = projectFaqBlock.faqs ?? [];

  /* -------------------------------------------------
     DEV SAFETY (fail loud)
  -------------------------------------------------- */
  if (import.meta.env.DEV) {
    if (
      !Array.isArray(globalFaqs) ||
      !Array.isArray(builderFaqs) ||
      !Array.isArray(projectFaqs)
    ) {
      throw new Error(
        "[mergeFaqs] FAQ sources must be arrays"
      );
    }
  }

  /* -------------------------------------------------
     META (PROJECT-OWNED ONLY)
  -------------------------------------------------- */
  const meta: SectionMeta = {
    eyebrow: projectFaqBlock.meta?.eyebrow ?? "FAQ",
    title:
      projectFaqBlock.meta?.title ??
      "Frequently Asked Questions",
    subtitle:
      projectFaqBlock.meta?.subtitle ??
      "Everything you should know before buying this home",
    tagline: projectFaqBlock.meta?.tagline,
  };

  /* -------------------------------------------------
     MERGE + DEDUPE (by question)
     Priority: Global → Builder → Project
  -------------------------------------------------- */
  const map = new Map<string, any>();

  for (const faq of globalFaqs) map.set(faq.question, faq);
  for (const faq of builderFaqs) map.set(faq.question, faq);
  for (const faq of projectFaqs) map.set(faq.question, faq);

  const faqs = Array.from(map.values());

  /* -------------------------------------------------
     FINAL SHAPE
  -------------------------------------------------- */
  return {
    meta,
    faqs,
  };
}
