import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useProject } from "@/lib/data/useProject";
import { getTemplate } from "@/templates/getTemplate";
import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

export default function ProjectPage() {
  const { slug: rawSlug } = useParams();

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
        <title>{project.meta?.title || project.projectName}</title>
        <meta
          name="description"
          content={
            project.meta?.description ||
            project.summary?.description ||
            ""
          }
        />
      </Helmet>

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
