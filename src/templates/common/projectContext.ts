// src/templates/common/projectContext.ts

/**
 * ============================================================
 * Project Context Factory
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Creates a stable runtime context for a single Project page
 * - Acts as the ONLY communication channel between:
 *
 *     Project Identity (slug, builder, type)
 *                ↓
 *        Section Renderer (Hero, Summary, etc.)
 *
 * - Provides canonical analytics context (flat, reusable)
 *
 * ============================================================
 */

import { runtimeLog } from "@/lib/log/runtimeLog";

/* ------------------------------------------------------------
   Types
------------------------------------------------------------ */

/**
 * Raw project identity coming from routing / data layer
 */
export type ProjectIdentity = {
  slug: string;          // canonical project_id
  builder: string;       // canonical builder_id (slug)
  type: string;
  projectName?: string;
  [key: string]: any;
};

/**
 * Runtime context passed to ALL project sections
 */
export type ProjectContext = {
  /**
   * Full structured payload for section resolution.
   */
  payload: Record<string, any>;

  /**
   * Indicates whether navigation/menu
   * should be auto-generated from sections.
   */
  autoMenu: boolean;

  /**
   * Cross-page CTA handler.
   * Sections may call this without knowing implementation.
   */
  openCTA: () => void;

  /**
   * ----------------------------------------------------------
   * Canonical analytics context (FLAT, READ-ONLY)
   * ----------------------------------------------------------
   * - Injected once at page creation
   * - Reused by all tracking calls
   * - Must conform to DATA_LAYER_CONTRACT
   */
  analytics: {
    project_id: string;
    builder_id: string;
    project_name?: string;
  };
};

/* ------------------------------------------------------------
   Context Factory
------------------------------------------------------------ */

/**
 * Creates the runtime context for a Project page.
 *
 * IMPORTANT:
 * - This must be called ONLY by a builder template
 * - Context must be passed unchanged into ProjectRenderer
 */
export function createProjectContext(
  project: ProjectIdentity,
  payload: Record<string, any>
): ProjectContext {
  // Canonical identifiers (NO enums, NO UI labels)
  const project_id = project.slug;
  const builder_id = project.builder;

  /* ----------------------------------------------------------
     Runtime diagnostics (DEBUG only)
     - Logs shape, never business data
     - Safe: runs once per page
  ---------------------------------------------------------- */
  runtimeLog("ProjectContext", "debug", "Context created", {
    project_id,
    builder_id,
    type: project?.type,
    payloadKeys: payload ? Object.keys(payload) : [],
  });

  return {
    /**
     * Structured section payload.
     * Hero, Summary, etc. read from here.
     */
    payload,

    /**
     * Enable automatic menu generation
     * from sections.config
     */
    autoMenu: true,

    /**
     * Central CTA handler.
     * Implementation injected elsewhere.
     * Must remain side-effect free.
     */
    openCTA: () => {
      /* injected elsewhere */
    },

    /**
     * ✅ SINGLE SOURCE OF ANALYTICS TRUTH
     * Used by ALL tracking calls
     */
    analytics: {
      project_id,
      builder_id,
      project_name: project.projectName,
    },
  };
}
