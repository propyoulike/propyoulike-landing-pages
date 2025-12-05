// src/lib/data/useProject.ts

import { useEffect, useState } from "react";
import type { ProjectData } from "@/content/schema/project.schema";
import { loadProject } from "./loadProject";

/**
 * Shape returned by this hook.
 */
interface UseProjectResult {
  project: ProjectData | null;
  loading: boolean;
  error: string | null;
}

/**
 * useProject(slug)
 * -----------------
 * Loads a project's JSON + merged builder overrides using loadProject().
 * Handles loading, errors, and cancellation on unmount.
 *
 * This hook is the ONLY place where project-loading state is managed.
 * All pages/components rely on this normalized interface.
 */
export function useProject(slug: string | null): UseProjectResult {

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /** -------------------------------------------------------
     * If slug is missing (undefined / empty), we stop early.
     * Prevents unnecessary loadProject() execution.
     * ------------------------------------------------------ */
    if (!slug || slug.trim() === "") {
      setLoading(false);
      return;
    }

    let cancelled = false; // prevents state updates after unmount

    async function fetchProject() {
      setLoading(true);
      setError(null);

      try {
        const data = await loadProject(slug);

        // Component unmounted?
        if (cancelled) return;

        // Project not found?
        if (!data) {
          setError("Project not found");
          setProject(null);
          return;
        }

        /** -------------------------------------------------------
         * Normalize project shape
         * Ensures frontend never breaks due to missing fields.
         * ------------------------------------------------------ */
        const normalized: ProjectData = {
          ...data,
          builder: data.builder || "default",
          type: data.type || "apartment",
          builderData: data.builderData ?? null,
          sections: data.sections ?? [],
        };

        setProject(normalized);
      } catch (err) {
        if (!cancelled) {
          console.error("❌ useProject error:", err);
          setError("Failed to load project");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProject();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { project, loading, error };
}
