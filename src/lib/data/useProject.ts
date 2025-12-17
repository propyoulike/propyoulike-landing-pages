// src/lib/data/useProject.ts

import { useEffect, useState } from "react";
import type { ProjectData } from "@/content/schema/project.schema";
import { loadProject } from "./loadProject";

interface UseProjectResult {
  project: ProjectData | null;
  loading: boolean;
  error: string | null;
}

export function useProject(slug: string | null): UseProjectResult {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // 🔒 Guard: invalid slug
    if (!slug || !slug.trim()) {
      setProject(null);
      setError(null);
      setLoading(false);
      return;
    }

    async function fetchProject() {
      setLoading(true);
      setError(null);

      try {
        const data = await loadProject(slug);

        if (cancelled) return;

        if (!data) {
          setProject(null);
          setError("Project not found");
          return;
        }

        // ✅ DO NOT mutate or normalize here
        setProject(data);
      } catch (err) {
        if (!cancelled) {
          console.error("❌ useProject error:", err);
          setProject(null);
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
