import type {
  FaqItem,
  ResolvedFaqItem,
  FaqSourceLevel,
} from "./faqTypes";

/* ---------------------------------------------
   Helpers
---------------------------------------------- */

const normalizeCategory = (c?: string) =>
  c?.trim() || "General";

const normalizeQuestion = (q: string) =>
  q.trim().toLowerCase();

/* ---------------------------------------------
   Load FAQ JSONs
---------------------------------------------- */

const faqGlob = import.meta.glob(
  "/src/content/projects/**/(*_faq|faq).json"
);

async function load(path: string): Promise<FaqItem[]> {
  if (!(path in faqGlob)) return [];

  try {
    const mod = await faqGlob[path]();
    return Array.isArray(mod.default) ? mod.default : [];
  } catch (err) {
    console.warn("Failed to load FAQ file:", path, err);
    return [];
  }
}

/* ---------------------------------------------
   Merge + Resolve FAQs
---------------------------------------------- */

export async function getMergedFaqs(
  builder: string,
  project: string
): Promise<ResolvedFaqItem[]> {
  const universal = await load("/src/content/projects/faq.json");
  const builderFaq = await load(
    `/src/content/projects/${builder}/builder_faq.json`
  );
  const projectFaq = await load(
    `/src/content/projects/${builder}/${project}/project_faq.json`
  );

  const tag = (
    faqs: FaqItem[],
    level: FaqSourceLevel
  ): ResolvedFaqItem[] =>
    faqs.map((f) => ({
      ...f,
      question: f.question.trim(),
      category: normalizeCategory(f.category),
      level,
    }));

  // Priority order: project → builder → universal
  const ordered = [
    ...tag(projectFaq, "project"),
    ...tag(builderFaq, "builder"),
    ...tag(universal, "universal"),
  ];

  // De-duplicate by question (keep highest priority)
  const seen = new Set<string>();
  const deduped: ResolvedFaqItem[] = [];

  for (const faq of ordered) {
    const key = normalizeQuestion(faq.question);
    if (seen.has(key)) continue;

    seen.add(key);
    deduped.push(faq);
  }

  return deduped;
}
