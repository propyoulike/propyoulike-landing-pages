import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useProject } from "@/lib/data/useProject";
import { getTemplate } from "@/templates/getTemplate";
import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";

export default function ProjectPage() {
  const { slug: routeSlug } = useParams();

  // 🔥 Correct routing slug resolver
  const resolvedSlug = useMemo(() => {
    if (routeSlug && routeSlug.trim() !== "") return routeSlug;
    const cleaned = window.location.pathname.replace(/^\/|\/$/g, "");
    return cleaned !== "" ? cleaned : null;
  }, [routeSlug]);

  const { project, loading, error } = useProject(resolvedSlug || "");

  const [Template, setTemplate] = useState(null);
  const [templateError, setTemplateError] = useState(null);

  // 🔍 Debug
  console.log("DEBUG URL:", window.location.pathname);
  console.log("DEBUG routeSlug:", routeSlug);
  console.log("DEBUG resolvedSlug:", resolvedSlug);
  console.log("DEBUG loaded project:", project);

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

// --------------------------
// Correct render flow
// --------------------------
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
      <Helmet>
        <title>{project.meta?.title || project.projectName}</title>
        <meta name="description" content={project.meta?.description || ""} />
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
