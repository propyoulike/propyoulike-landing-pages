import { useEffect, useState } from "react";
import ProjectSEO from "@/components/seo/ProjectSEO";
import Footer from "@/components/footer/Footer";
import FloatingQuickNav from "@/templates/common/FloatingQuickNav";
import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";
import { getTemplate } from "@/templates/getTemplate";
import { TrackingProvider } from "@/lib/tracking/TrackingContext";

export default function ProjectDocumentPage({ project }) {
  const [Template, setTemplate] = useState<any>(null);

  useEffect(() => {
    const tpl = getTemplate(project.builder, project.type);
    setTemplate(() => tpl);
  }, [project]);

  if (!Template) return <div>Loading template…</div>;

  return (
    <>
      {/* SEO FIRST – ensures correct page title */}
      <ProjectSEO project={project} />

      {/* ✅ GLOBAL TRACKING CONTEXT (SINGLE SOURCE OF TRUTH) */}
      <TrackingProvider
        context={{
          // platform identity
          platform: "propyoulike",
          source: "web",

          // page identity
          page_type: "project",
          page_slug: project.slug,

          // business identity
          project_id: project.slug,
          project_name: project.projectName,
          builder_id: project.builder,
        }}
      >
        {/* Lead system (modal / drawer) */}
        <LeadCTAProvider
          projectName={project.projectName}
          projectId={project.slug}
          whatsappNumber="919379822010"
        >
          <Template project={project} />
        </LeadCTAProvider>

        {/* UI */}
        <FloatingQuickNav footerId="site-footer" />
        <Footer id="site-footer" project={project} />
      </TrackingProvider>
    </>
  );
}
