import type { FaqItem, ResolvedFaqItem, FaqSourceLevel } from "./faqTypes";

const normalizeCategory = (c?: string) => (c?.trim() || "General");

// Load all JSON files under /src/content/projects
const faqGlob = import.meta.glob(
  "/src/content/projects/**/(*_faq|faq).json"
);

async function load(path: string): Promise<FaqItem[]> {
  if (!(path in faqGlob)) return [];
  try {
    const mod = await faqGlob[path]();
    return mod.default || [];
  } catch (err) {
    console.warn("Failed to load FAQ file:", path, err);
    return [];
  }
}

export async function getMergedFaqs(builder: string, project: string): Promise<ResolvedFaqItem[]> {
  const universal = await load("/src/content/projects/faq.json");
  const builderFaq = await load(`/src/content/projects/${builder}/builder_faq.json`);
  const projectFaq = await load(`/src/content/projects/${builder}/${project}/project_faq.json`);

  const tag = (faqs: FaqItem[], level: FaqSourceLevel): ResolvedFaqItem[] =>
    faqs.map(f => ({
      ...f,
      category: normalizeCategory(f.category),
      level
    }));

  return [
    ...tag(universal, "universal"),
    ...tag(builderFaq, "builder"),
    ...tag(projectFaq, "project"),
  ];
}
