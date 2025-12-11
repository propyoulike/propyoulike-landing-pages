import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "@/lib/data/useProject";
import { getTemplate } from "@/templates/getTemplate";
import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";

import ProjectSEO from "@/components/seo/ProjectSEO";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

export default function ProjectPage() {
  const { slug: routeSlug } = useParams();

  /**
   * RESOLVE FINAL SLUG
   * - Works for /slug
   * - Works even if router didn't pass slug (DynamicRouter fallback)
   */
  const resolvedSlug = useMemo(() => {
    if (routeSlug && routeSlug.trim() !== "") return routeSlug;

    const cleaned = window.location.pathname.replace(/^\/|\/$/g, "");
    return cleaned !== "" ? cleaned : null;
  }, [routeSlug]);

  const { project, loading, error } = useProject(resolvedSlug || "");

  const [Template, setTemplate] = useState(null);
  const [templateError, setTemplateError] = useState(null);

  useEffect(() => {
    if (!project) return;

    if (!project.builder || !project.type) {
      setTemplateError("No template available for this project.");
      return;
    }

    const tpl = getTemplate(project.builder, project.type);
    if (!tpl) {
      setTemplateError("No template available for this project.");
    } else {
      setTemplate(() => tpl);
    }
  }, [project]);

  // -------------------------------------------------------------
  // RENDER FLOW
  // -------------------------------------------------------------
  if (!resolvedSlug) {
    return <div>Invalid project URL</div>;
  }

  if (loading || !project) {
    return <div>Loading…</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (templateError) {
    return <div>{templateError}</div>;
  }

  if (!Template) {
    return <div>Loading template…</div>;
  }

  return (
    <>
      {/* ⭐ Full SEO for project */}
      <ProjectSEO project={project} />

      {/* ⭐ Auto Breadcrumbs */}
      <Breadcrumbs />

      <LeadCTAProvider
        projectName={project.projectName}
        projectId={project.slug}
        whatsappNumber="919379822010"
      >
        <Template project={project} />
      </LeadCTAProvider>
    </>
  );
}
