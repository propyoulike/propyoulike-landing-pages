import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

// Default Templates
import ApartmentDefault from "@/templates/default/ApartmentDefault";
import VillaDefault from "@/templates/default/VillaDefault";
import PlotDefault from "@/templates/default/PlotDefault";

// Builder-Specific Templates
import ApartmentProvident from "@/templates/builders/provident/ApartmentProvident";
import VillaProvident from "@/templates/builders/provident/VillaProvident";
import PlotProvident from "@/templates/builders/provident/PlotProvident";

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
  [key: string]: any;
}

const DefaultTemplates = {
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
  prestige: {
    apartment: ApartmentDefault, // Placeholder
    villa: VillaDefault,
    plot: PlotDefault,
  },
  sobha: {
    apartment: ApartmentDefault, // Placeholder
    villa: VillaDefault,
    plot: PlotDefault,
  },
  brigade: {
    apartment: ApartmentDefault, // Placeholder
    villa: VillaDefault,
    plot: PlotDefault,
  },
  lodha: {
    apartment: ApartmentDefault, // Placeholder
    villa: VillaDefault,
    plot: PlotDefault,
  },
};

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await import(`@/content/projects/${slug}.json`);
        setProjectData(data.default || data);
        
        // Load theme CSS dynamically
        const theme = (data.default || data).theme;
        const builder = (data.default || data).builder;
        
        if (theme === "custom" && builder) {
          const themeLink = document.createElement("link");
          themeLink.rel = "stylesheet";
          themeLink.href = `/src/themes/builders/${builder}.css`;
          themeLink.id = `theme-${builder}`;
          document.head.appendChild(themeLink);
          
          return () => {
            const existingLink = document.getElementById(`theme-${builder}`);
            if (existingLink) {
              existingLink.remove();
            }
          };
        }
      } catch (err) {
        console.error("Failed to load project:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return <Navigate to="/404" replace />;
  }

  // Template Selection Logic
  const template = projectData.template || "default";
  const builder = projectData.builder?.toLowerCase();
  const propertyType = projectData.type;

  let TemplateComponent;
  
  if (template === "custom" && builder && BuilderTemplates[builder]?.[propertyType]) {
    TemplateComponent = BuilderTemplates[builder][propertyType];
  } else {
    TemplateComponent = DefaultTemplates[propertyType] || ApartmentDefault;
  }

  return (
    <>
      <Helmet>
        <title>{projectData.name} | PropYouLike</title>
        <meta name="description" content={projectData.description} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={projectData.name} />
        <meta property="og:description" content={projectData.description} />
        <meta property="og:url" content={`https://propyoulike.com/projects/${slug}`} />
        <meta property="og:type" content="website" />
        {projectData.ogImage && (
          <meta property="og:image" content={projectData.ogImage} />
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={projectData.name} />
        <meta name="twitter:description" content={projectData.description} />
        {projectData.ogImage && (
          <meta name="twitter:image" content={projectData.ogImage} />
        )}
        
        {/* Video Preview */}
        {projectData.shareVideo && (
          <>
            <meta property="og:video" content={projectData.shareVideo} />
            <meta property="og:video:secure_url" content={projectData.shareVideo} />
            <meta property="og:video:type" content="text/html" />
            <meta property="og:video:width" content="1280" />
            <meta property="og:video:height" content="720" />
          </>
        )}
      </Helmet>
      
      <TemplateComponent data={projectData} />
    </>
  );
};

export default ProjectPage;
