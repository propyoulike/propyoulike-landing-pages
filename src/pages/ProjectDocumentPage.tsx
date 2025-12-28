import { useEffect, useState } from "react";
import ProjectSEO from "@/components/seo/ProjectSEO";
import Footer from "@/components/footer/Footer";
import FloatingQuickNav from "@/templates/common/FloatingQuickNav";
import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";
import { getTemplate } from "@/templates/getTemplate";

export default function ProjectDocumentPage({ project }) {
  console.log("🏗️ Document project:", project);

  const [Template, setTemplate] = useState<any>(null);

  useEffect(() => {
    const tpl = getTemplate(project.builder, project.type);
    setTemplate(() => tpl);
  }, [project]);

  if (!Template) return <div>Loading template…</div>;

  return (
    <>
      <ProjectSEO project={project} />

      {/* ❌ NO Breadcrumbs (router-based) */}

      <LeadCTAProvider
        projectName={project.projectName}
        projectId={project.slug}
        whatsappNumber="919379822010"
      >
        <Template project={project} />
      </LeadCTAProvider>

      <FloatingQuickNav footerId="site-footer" />
      <Footer id="site-footer" project={project} />
    </>
  );
}
