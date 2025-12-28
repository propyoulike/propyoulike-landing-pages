// src/lib/data/project/getProjectByFullSlug.ts

import { allProjectMetas } from "@/lib/data/loadProject";

export function getProjectByFullSlug(fullSlug: string) {
  if (typeof fullSlug !== "string") return null;

  const normalizedFullSlug = fullSlug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  return allProjectMetas.find((project) => {

    if (!project.builder || !project.slug) return false;

    const projectFullSlug = `${project.builder}-${project.slug}`
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    return projectFullSlug === normalizedFullSlug;
  }) || null;
}
