// src/lib/data/project/mergeFaqs.ts

export function mergeFaqs({
  builder,
  projectSlug,
  hydrated,
  getJSON,
}: {
  builder: string;
  projectSlug: string;
  hydrated: any;
  getJSON: (path: string) => any;
}) {
  /* -----------------------------
     Load FAQ sources (safe)
  ------------------------------ */
  const globalFaq =
    getJSON("/src/content/projects/faq.json")?.faqs ?? [];

  const builderFaq =
    getJSON(`/src/content/projects/${builder}/builder_faq.json`)?.faqs ?? [];

  const projectFaq =
    getJSON(
      `/src/content/projects/${builder}/${projectSlug}/faq.json`
    )?.faqs ?? [];

  /* -----------------------------
     Title & subtitle precedence
     Project > Builder > Global > Default
  ------------------------------ */
  const title =
    hydrated.faq?.title ??
    hydrated.builder?.faq?.title ??
    "Frequently Asked Questions";

  const subtitle =
    hydrated.faq?.subtitle ??
    hydrated.builder?.faq?.subtitle ??
    "Everything you should know before buying this home";

  /* -----------------------------
     Merge order matters
     (lowest → highest priority)
  ------------------------------ */
  return {
    title,
    subtitle,
    faqs: [
      ...globalFaq,
      ...builderFaq,
      ...projectFaq,
    ],
  };
}
