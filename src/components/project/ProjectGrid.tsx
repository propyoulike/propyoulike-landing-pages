// src/components/project/ProjectGrid.tsx

import ProjectCard from "./ProjectCard";

interface Project {
  slug: string;
  projectName: string;
  city?: string;
  locality?: string;
  hero?: {
    images?: string[];
  };
  price?: {
    min?: string;
    max?: string;
  };
}

interface ProjectGridProps {
  projects: Project[];
  emptyText?: string;
}

export default function ProjectGrid({
  projects,
  emptyText = "No projects available",
}: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
