// src/lib/data/loadProject.ts

import { ProjectSchema, type ProjectData } from "@/content/schema/project.schema";
import {
  buildAllProjectMetas,
  loadBaseProject,
  hydrateFiles,
  mergeFaqs,
} from "./project";
import { getRelatedProjects } from "./project/getRelatedProjects";

/* -------------------------------------------------
   Load ALL JSON files once (Vite eager glob)
-------------------------------------------------- */
const contentFiles = import.meta.glob("/src/content/**/*.json", {
  eager: true,
}) as Record<string, any>;

function getJSON(path: string) {
  const mod = contentFiles[path];
  return mod ? mod.default ?? mod : null;
}

/* -------------------------------------------------
   Global fallback data
-------------------------------------------------- */
const globalLoanSupport = getJSON(
  "/src/content/global/loanSupport.json"
);

/* -------------------------------------------------
   Build project meta index ONCE
-------------------------------------------------- */
export const allProjectMetas = buildAllProjectMetas(contentFiles);

/* -------------------------------------------------
   Public accessor (used by homepage, etc.)
-------------------------------------------------- */
export function getAllProjectMetas() {
  return allProjectMetas;
}

/* -------------------------------------------------
   Slug guard
-------------------------------------------------- */
export function isProjectSlug(slug: string): boolean {
  return allProjectMetas.some((p) => p.slug === slug);
}

/* -------------------------------------------------
   City helpers (used elsewhere)
-------------------------------------------------- */
export function getProjectsByCity(city: string) {
  return allProjectMetas.filter(
    (p) => p.city?.toLowerCase() === city.toLowerCase()
  );
}

/* -------------------------------------------------
   MAIN PROJECT LOADER
-------------------------------------------------- */
export async function loadProject(
  slug: string
): Promise<
  ProjectData & {
    resolved: {
      loanSupport: any;
    };
  }
> {
  if (!slug) {
    throw new Error("❌ loadProject called without slug");
  }

  if (!isProjectSlug(slug)) {
    throw new Error(`❌ Invalid project slug: ${slug}`);
  }

  /* ------------------ Base project ------------------ */
  const { builder, projectSlug, base } = loadBaseProject(
    slug,
    getJSON
  );

  /* ------------------ Hydration ------------------ */
  let hydrated = hydrateFiles(
    structuredClone(base),
    builder,
    projectSlug,
    getJSON
  );

  /* ------------------ FAQ merge ------------------ */
  hydrated.faq = mergeFaqs({
    builder,
    projectSlug,
    hydrated,
    getJSON,
  });

  /* ------------------ Schema validation ------------------ */
  let parsed: ProjectData;

  try {
    parsed = ProjectSchema.parse(hydrated);
  } catch (err) {
    console.error("❌ Project schema validation failed:", slug, err);
    throw err;
  }

  /* -------------------------------------------------
     🔑 RESOLVED DATA (GLOBAL → BUILDER → PROJECT)
     SINGLE SOURCE OF TRUTH
  -------------------------------------------------- */
  const resolved = {
    loanSupport:
      parsed.loanSupport ??
      hydrated.builder?.loanSupport ??
      globalLoanSupport,
  };

  /* ------------------ Related projects ------------------ */
  const related = getRelatedProjects(
    allProjectMetas,
    slug,
    {
      builderLimit: 4,
      localityLimit: 4,
    }
  );

  /* ------------------ Final enriched project ------------------ */
  return {
    ...parsed,

    // 👇 required for $resolved.*
    resolved,

    builderProjects: related.builderProjects,
    localityProjects: related.localityProjects,
  };
}
