import { Navigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";

// Default Templates
import ApartmentDefault from "@/templates/default/ApartmentDefault";
import VillaDefault from "@/templates/default/VillaDefault";
import PlotDefault from "@/templates/default/PlotDefault";

// Provident Templates
import ApartmentProvident from "@/templates/builders/provident/ApartmentProvident";
import VillaProvident from "@/templates/builders/provident/VillaProvident";
import PlotProvident from "@/templates/builders/provident/PlotProvident";

import Footer from "@/components/Footer/Footer";

interface ProjectData {
  slug: string;
  type: "apartment" | "villa" | "plot";
  builder: string;
  template?: "default" | "custom";
  theme?: "default" | "custom";
  name: string;
  description: string;
  ogImage?: string;
  shareVideo?: string;
  footer?: any;
  locality?: string;
  [key: string]: any;
}

const DefaultTemplates: Record<string, any> = {
  apartment: ApartmentDefault,
  villa: VillaDefault,
  plot: PlotDefault,
};

const BuilderTemplates: Record<string, Record<string, any>> = {
  provident: {
    apartment: ApartmentProvident,
    villa: VillaProvident,
    plot: PlotProvident,
  },
};

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all project JSON files bundled by Vite
  const allProjects = useMemo(() => {
    const modules = import.meta.glob("@/content/projects/*.json", { eager: true }) as Record<
      string,
      { default: ProjectData }
    >;

    const map: Record<string, ProjectData> = {};
    Object.keys(modules).forEach((path) => {
      const json = modules[path].default;
      const key = json.slug || path.split("/").pop()!.replace(".json", "");
      map[key] = json;
    });

    return map;
  }, []);

  // Load project + theme
  useEffect(() => {
    if (!slug) return;

    const data = allProjects[slug];
    if (!data) {
      setProjectData(null);
      setLoading(false);
      return;
    }

    setProjectData(data);

    // Load theme CSS with safe fallback
    const builder = data.builder?.toLowerCase();
    const theme = data.theme || "default";

    (async () => {
      if (theme === "custom" && builder) {
        try {
          await import(`@/themes/builders/${builder}.css`);
        } catch (e) {
          console.warn(`Builder theme not found for ${builder}, using default.`);
          await import("@/themes/default.css");
        }
      } else {
        await import("@/themes/default.css");
      }
    })();

    setLoading(false);
  }, [slug, allProjects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p>Loading project...</p>
      </div>
    );
  }

  if (!projectData) {
    return <Navigate to="/404" replace />;
  }

  // Select template
  const propertyType = projectData.type;
  const builder = projectData.builder?.toLowerCase();
  const template = projectData.template || "default";

  let TemplateComponent;

  if (
    template === "custom" &&
    builder &&
    BuilderTemplates[builder] &&
    BuilderTemplates[builder][propertyType]
  ) {
    TemplateComponent = BuilderTemplates[builder][propertyType];
  } else {
    TemplateComponent = DefaultTemplates[propertyType] || ApartmentDefault;
  }

  return (
    <>
      {/* Helmet only when projectData exists */}
      {projectData && (
        <Helmet>
          {/* --------------------------- */}
          {/* SAFE TITLE (always string) */}
          {/* --------------------------- */}

          <title>{`${String(projectData.name)} | PropYouLike`}</title>

          <meta
            name="description"
            content={String(projectData.description || "")}
          />

          {/* OG BASIC */}
          <meta property="og:title" content={String(projectData.name || "")} />
          <meta
            property="og:description"
            content={String(projectData.description || "")}
          />
          <meta
            property="og:url"
            content={`https://propyoulike.com/projects/${slug}`}
          />

          {projectData.ogImage && (
            <meta property="og:image" content={projectData.ogImage} />
          )}

          {/* TWITTER */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={String(projectData.name || "")} />
          <meta
            name="twitter:description"
            content={String(projectData.description || "")}
          />

          {projectData.ogImage && (
            <meta name="twitter:image" content={projectData.ogImage} />
          )}

          {/* SOCIAL VIDEO (OPTIONAL) */}
          {projectData.shareVideo && (
            <>
              <meta property="og:video" content={projectData.shareVideo} />
              <meta
                property="og:video:secure_url"
                content={projectData.shareVideo}
              />
              <meta property="og:video:type" content="text/html" />
              <meta property="og:video:width" content="1280" />
              <meta property="og:video:height" content="720" />
            </>
          )}
        </Helmet>
      )}

      {/* MAIN TEMPLATE RENDER */}
      <TemplateComponent data={projectData} />

      {/* FOOTER WITH PROJECT DATA */}
      <Footer
        data={projectData.footer ?? null}
        projectName={projectData.name}
        builder={projectData.builder}
        locality={projectData.locality}
      />
    </>
  );
};

export default ProjectPage;
