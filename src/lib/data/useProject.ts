// src/lib/data/useProject.ts
import { useEffect, useState } from "react";
import type { ProjectData } from "@/content/schema/project.schema";
import { loadProject } from "./loadProject";

interface UseProjectResult {
  project: ProjectData | null;
  loading: boolean;
  error: string | null;
}

export function useProject(slug: string): UseProjectResult {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid project slug");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchProject() {
      setLoading(true);
      setError(null);

      try {
        const data = await loadProject(slug);

        if (cancelled) return;

        if (!data) {
          setError("Project not found");
          setProject(null);
          return;
        }

        // ---- Final Normalization Layer ----
        const normalized: ProjectData = {
          ...data,
          builder: data.builder || "default",
          type: data.type || "apartment",
          builderData: data.builderData ?? null, // ensure added
          sections: data.sections ?? [],         // avoid undefined
        };

        setProject(normalized);
      } catch (err) {
        if (!cancelled) {
          console.error("❌ useProject error:", err);
          setError("Failed to load project");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProject();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { project, loading, error };
}
