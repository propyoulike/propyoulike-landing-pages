import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import { useProject } from "@/lib/data/useProject";
import { getTemplate } from "@/templates/getTemplate";
import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";

export default function ProjectPage() {
  const params = useParams();

  // Always run hooks FIRST — no conditional returns
  const [stableSlug, setStableSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!stableSlug && params.slug && typeof params.slug === "string") {
      setStableSlug(params.slug);
    }
  }, [params.slug, stableSlug]);

  // Now it is safe to use hooks
  const { project, loading } = useProject(stableSlug || "");

  const [Template, setTemplate] =
    useState<React.ComponentType<any> | null>(null);

  const [templateError, setTemplateError] = useState<string | null>(null);

  useEffect(() => {
    if (!project) return;

    if (!project.builder || !project.type) {
      setTemplateError("No template available for this project.");
      return;
    }

    const tpl = getTemplate(project.builder, project.type);
    if (!tpl) setTemplateError("No template available for this project.");
    else setTemplate(() => tpl);
  }, [project]);

  // --------------------------------------------------------------------
  // RENDER GUARDS (safe because all hooks above already executed)
  // --------------------------------------------------------------------

  if (!stableSlug) return <div>Loading project…</div>;
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
