// ------------------------------------------------------
// Project Page
// ------------------------------------------------------
// Responsibilities:
// 1. Read :slug from URL
// 2. Load project JSON using loadProject()
// 3. Handle loading + error states
// 4. Render SEO + Dynamic Sections + Footer
// ------------------------------------------------------

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProjectRenderer from "@/templates/common/ProjectRenderer";
import Footer from "@/components/footer/Footer";
import ProjectSEO from "@/components/seo/ProjectSEO";

import { loadProject } from "@/lib/data/loadProject";
import type { ProjectData } from "@/content/schema/project.schema";

export default function ProjectPage() {
  // --------------------------------------------------
  // 1. Pull slug from the route:  /projects/:slug
  // --------------------------------------------------
  const { slug } = useParams<{ slug: string }>();

  // --------------------------------------------------
  // Local State
  // --------------------------------------------------
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------
  // 2. Load Project Data Whenever Slug Changes
  // --------------------------------------------------
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

    // Cleanup to avoid updating state on unmounted component
    return () => {
      mounted = false;
    };
  }, [slug]);

  // --------------------------------------------------
  // 3. Loading / Error / Empty States
  // --------------------------------------------------
  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>Project Not Found</div>;

  // --------------------------------------------------
  // 4. Render SEO + Dynamic Sections + Footer
  // --------------------------------------------------
  return (
    <>
      {/* SEO Meta Tags */}
      <ProjectSEO project={project} />

      {/* Main Content Sections */}
      <ProjectRenderer project={project} />

      {/* Global Footer */}
      <Footer />
    </>
  );
}
