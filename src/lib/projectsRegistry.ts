import type { ProjectData } from "@/content/schema/project.schema";
import { loadProject } from "@/lib/data/loadProject";

const cache = new Map<string, ProjectData>();

// Load all projects ONCE
export async function loadAllProjects(): Promise<ProjectData[]> {
  if (cache.size) return Array.from(cache.values());

  const slugs = [
    "provident-sunworth-city",
    "provident-botanico",
    "provident-capella",
    "provident-deansgate",
  ];

  for (const slug of slugs) {
    const data = await loadProject(slug);
    if (data) cache.set(slug, data);
  }

  return Array.from(cache.values());
}

export async function getProject(slug: string) {
  if (!cache.size) await loadAllProjects();
  return cache.get(slug);
}
