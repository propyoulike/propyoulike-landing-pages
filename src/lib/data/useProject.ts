// src/lib/data/useProject.ts

/**
 * ============================================================
 * useProject (DEV Data Loader)
 * ============================================================
 *
 * DEV-only data loader that MUST mirror PROD runtime shape.
 * ============================================================
 */

import { useEffect, useState } from "react";
import { loadProject } from "./loadProject";
import { normalizeProjectImages } from "./normalizeProjectImages";
import { runtimeLog } from "@/lib/log/runtimeLog";

import type { ProjectData } from "@/content/schema/project.schema";

/* ------------------------------------------------------------
   Types
------------------------------------------------------------ */

export interface UseProjectResult {
  project: ProjectData | null;         // FLAT identity only
  payload: Record<string, any> | null; // FULL structured payload
  loading: boolean;
  error: string | null;
}

/* ------------------------------------------------------------
   Hook
------------------------------------------------------------ */

export function useProject(slug: string | null): UseProjectResult {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [payload, setPayload] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    /* --------------------------------------------------------
       Guard: invalid slug
    -------------------------------------------------------- */
    if (!slug || !slug.trim()) {
      runtimeLog("useProject", "warn", "Empty or invalid slug", { slug });
      setProject(null);
      setPayload(null);
      setLoading(false);
      return;
    }

    async function fetchProject() {
      setLoading(true);
      setError(null);

      runtimeLog("useProject", "info", "Loading project", { slug });

      try {
        /* ----------------------------------------------------
           Load FULL payload
        ---------------------------------------------------- */
        const rawPayload = await loadProject(slug);
        if (cancelled) return;

        if (!rawPayload || typeof rawPayload !== "object") {
          throw new Error("PROJECT_PAYLOAD_NOT_FOUND");
        }

        /* ----------------------------------------------------
           Normalize assets ONLY (non-structural)
        ---------------------------------------------------- */
        const normalizedPayload = normalizeProjectImages(rawPayload);

        /* ----------------------------------------------------
           HARD CONTRACT CHECKS
        ---------------------------------------------------- */
        const identity = (normalizedPayload as any).project;

        if (!identity) {
          throw new Error("PROJECT_IDENTITY_MISSING");
        }

        if (
          typeof identity.slug !== "string" ||
          typeof identity.builder !== "string" ||
          typeof identity.type !== "string"
        ) {
          throw new Error("PROJECT_IDENTITY_INVALID");
        }

        /* ----------------------------------------------------
           Commit state
        ---------------------------------------------------- */
        setProject(identity);
        setPayload(normalizedPayload);

        runtimeLog("useProject", "info", "Project loaded", {
          slug,
          builder: identity.builder,
          type: identity.type,
          payloadKeys: Object.keys(normalizedPayload),
        });
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof Error ? err.message : "PROJECT_LOAD_FAILED";

        runtimeLog("useProject", "fatal", "Project load failed", {
          slug,
          error: message,
        });

        setProject(null);
        setPayload(null);
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProject();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { project, payload, loading, error };
}
