import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useProject } from "@/lib/data/useProject";
import { getTemplate } from "@/templates/getTemplate";
import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";

export default function ProjectPage() {
  const { slug: rawSlug } = useParams();
  const location = useLocation();

  // 🔥 Freeze slug permanently (cannot change on re-renders)
  const slug = useRef(rawSlug || "").current;

  // Load project with *stable* slug
  const { project, loading, error } = useProject(slug);

  const [Template, setTemplate] = useState<React.ComponentType<any> | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);

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

  // -------------------------
  // Render States
  // -------------------------
  if (!slug) {
    console.log("%c[ERROR] NO SLUG — Invalid project URL", "color:red;font-weight:bold;");
    return <div>Invalid project URL</div>;
  }

  if (loading) return <div>Loading project…</div>;
  if (!project) return <div>404 – Project not found</div>;
  if (templateError) return <div>{templateError}</div>;
  if (!Template) return <div>Loading template…</div>;

  return (
    <>
      <Helmet>
        <title>{project.meta?.title || project.name}</title>
        <meta
          name="description"
          content={
            project.meta?.description ||
            project.tagline ||
            project.overview ||
            ""
          }
        />
      </Helmet>

      <LeadCTAProvider
        projectName={project.name}
        projectId={project.slug}
        whatsappNumber={project.whatsappNumber || "919379822010"}
        trackEvent={(event, data) => {
          if (window.dataLayer) {
            window.dataLayer.push({
              event,
              project: project.name,
              project_id: project.slug,
              ...data,
            });
          }
        }}
      >
        <Template project={project} />
      </LeadCTAProvider>
    </>
  );
}
