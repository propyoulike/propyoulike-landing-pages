// src/pages/ProjectPage.tsx
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "@/lib/data/useProject";
import { getTemplate } from "@/templates/getTemplate";
import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";

import Footer from "@/components/footer/Footer";
import ProjectSEO from "@/components/seo/ProjectSEO";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import FloatingQuickNav from "@/templates/common/FloatingQuickNav";

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();

  /* ---------------------------------------
     Slug resolution (router-first)
  ---------------------------------------- */
  const resolvedSlug = useMemo(() => {
    return slug && slug.trim() !== "" ? slug : null;
  }, [slug]);

  const { project, loading, error } = useProject(resolvedSlug);

  const [Template, setTemplate] = useState<any>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);

  /* ---------------------------------------
     Resolve template
  ---------------------------------------- */
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

  /* ---------------------------------------
     Render guards
  ---------------------------------------- */
  if (!resolvedSlug) return <div>Invalid project URL</div>;
  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>Project not found</div>;
  if (templateError) return <div>{templateError}</div>;
  if (!Template) return <div>Loading template…</div>;

  return (
    <>
      {/* SEO */}
      <ProjectSEO project={project} />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Lead + CTA Context */}
      <LeadCTAProvider
        projectName={project.projectName}
        projectId={project.slug}
        whatsappNumber="919379822010"
        trackEvent
      >
        {/* Main project content */}
        <Template project={project} />
      </LeadCTAProvider>

      {/* ⭐ Floating Quick Nav (mobile only)
          – outside CTA provider
          – auto-hides near footer */}
      <FloatingQuickNav footerId="site-footer" />

      {/* Footer */}
      <Footer id="site-footer" project={project} />
    </>
  );
}
