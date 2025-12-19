// src/pages/CityPage.tsx
import { useParams } from "react-router-dom";
import { useMemo } from "react";

import { allProjectMetas } from "@/lib/data/loadProject";
import { getProjectsByCity } from "@/lib/data/project/getProjectsByCity";
import type { ProjectMeta } from "@/lib/data/project/buildProjectMeta";

import ProjectCard from "@/components/project/ProjectCard";
import SEO from "@/components/seo/SEO";
import Footer from "@/components/footer/Footer";

export default function CityPage() {
  const { city } = useParams<{ city: string }>();

  /* -------------------------------------------
     Defensive guard
  -------------------------------------------- */
  const cityName = city?.toLowerCase();

  /* -------------------------------------------
     Get projects (SYNC, from meta index)
  -------------------------------------------- */
  const projects: ProjectMeta[] = useMemo(() => {
    if (!cityName) return [];
    return getProjectsByCity(allProjectMetas, cityName);
  }, [cityName]);

  /* -------------------------------------------
     Guards
  -------------------------------------------- */
  if (!cityName) {
    return <div className="container py-20">Invalid city</div>;
  }

  /* -------------------------------------------
     Render
  -------------------------------------------- */
  return (
    <>
      <SEO
        title={`Projects in ${cityName} | PropYouLike`}
        description={`Explore apartments, townships and residential projects in ${cityName}.`}
      />

      <main className="container mx-auto px-4 py-14 max-w-6xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 capitalize">
          Projects in {cityName}
        </h1>

        {projects.length === 0 ? (
          <p className="text-muted-foreground">
            No projects found in this city.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer (generic) */}
      <Footer city={city}/>
    </>
  );
}
