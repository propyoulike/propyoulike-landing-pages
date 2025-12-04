// src/pages/ProjectPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProjectRenderer from "@/templates/common/ProjectRenderer";
import Footer from "@/components/footer/Footer";
import ProjectSEO from "@/components/seo/ProjectSEO";

import { loadProject } from "@/lib/data/loadProject";
import type { ProjectData } from "@/content/schema/project.schema";

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid slug");
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchData() {
      try {
        const data = await loadProject(slug);
        if (!mounted) return;

        if (!data) {
          setError("Project not found");
          setProject(null);
        } else {
          setProject(data);
        }
      } catch (e) {
        if (mounted) setError("Failed to load project");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>Project Not Found</div>;

  return (
    <>
      {/* ⭐ Critical for SEO */}
      <ProjectSEO project={project} />

      {/* 🔥 Dynamic Builder+Project Sections */}
      <ProjectRenderer project={project} />

      <Footer />
    </>
  );
}
