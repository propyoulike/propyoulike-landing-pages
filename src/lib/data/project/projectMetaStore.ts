// src/lib/data/project/projectMetaStore.ts

import { buildAllProjectMetas } from "./buildProjectMeta";

/**
 * Load ALL project JSON files (Vite-native)
 * This is the single source of truth for project metadata.
 */
const projectFiles = import.meta.glob(
  "/src/content/projects/**/index.json",
  { eager: true }
) as Record<string, any>;

export const allProjectMetas = buildAllProjectMetas(projectFiles);
