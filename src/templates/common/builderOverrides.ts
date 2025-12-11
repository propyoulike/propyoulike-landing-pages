// src/templates/common/builderOverrides.ts
// Simple registry for builder-specific section overrides.
// Each builder may export and call `registerBuilderSections` from its template entry.

import type { SectionName } from "./sections.config";
import type { ProjectData } from "@/content/schema/project.schema";

export type SectionDefOverride = Partial<{
  Component: any; // React component (lazy or direct)
  id: string | ((project: ProjectData) => string | undefined);
  props: (...args: any[]) => Record<string, any>;
  menuVisible: boolean;
  menuLabel: string;
  menuOrder: number;
}>;

const REGISTRY: Record<string, Record<SectionName, SectionDefOverride>> = {};

/** Register overrides for a builder. Called from a builder-specific file. */
export function registerBuilderSections(
  builder: string,
  overrides: Record<SectionName, SectionDefOverride>
) {
  if (!builder) return;
  REGISTRY[builder] = {
    ...(REGISTRY[builder] || {}),
    ...overrides,
  };
}

/** Retrieve overrides for a builder (or empty object). */
export function getBuilderOverrides(builder?: string) {
  if (!builder) return {};
  return REGISTRY[builder] || {};
}
