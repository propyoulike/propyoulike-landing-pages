import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProjectsByCity } from "@/lib/data/loadProject"; 
import type { ProjectData } from "@/content/schema/project.schema";

import ProjectCard from "@/components/project/ProjectCard";
import SEO from "@/components/seo/SEO";

export default function CityPage() {
  const { city } = useParams();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    async function load() {
      setLoading(true);
      const result = await getProjectsByCity(city);
      setProjects(result || []);
      setLoading(false);
    }

    load();
  }, [city]);

  if (loading) return <div className="container py-20">Loading projects…</div>;

  return (
    <div className="container py-10">
      <SEO
        title={`${city} — Real Estate Projects`}
        description={`Explore top residential projects, apartments, and townships in ${city}.`}
      />

      <h1 className="text-3xl font-bold mb-6 capitalize">
        Projects in {city}
      </h1>

      {projects.length === 0 ? (
        <p>No projects found in this city.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
