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
 * ============================================================
 */

import { runtimeLog } from "@/lib/log/runtimeLog";

/* ------------------------------------------------------------
   Types
------------------------------------------------------------ */

export type ProjectIdentity = {
  slug: string;
  builder: string;
  type: string;
  projectName?: string;
  [key: string]: any;
};

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
  /* ----------------------------------------------------------
     Runtime diagnostics (DEBUG only, structured)
     Safe because:
     - Runs once per page
     - Logs shape, not data
  ---------------------------------------------------------- */
  runtimeLog("ProjectContext", "debug", "Context created", {
    slug: project?.slug,
    builder: project?.builder,
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
     * Must remain side-effect free.
     */
    openCTA: () => {
      /* implementation injected elsewhere */
    },
  };
}
