import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface Project {
  slug: string;
  name: string;
  builder: string;
  locality: string;
  heroImage: string;
  priceRange?: string;
  status?: string;
}

interface BuilderOtherProjectsProps {
  currentSlug: string;
  builder: string;
  otherProjects?: Array<{ slug: string; priority: number }>;
  excludeProjects?: string[];
}

const BuilderOtherProjects = ({ 
  currentSlug, 
  builder, 
  otherProjects,
  excludeProjects = []
}: BuilderOtherProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const indexData = await import("@/data/projects-index.json");
        const allProjects: Project[] = indexData.default || indexData;

        let filtered: Project[] = [];

        if (otherProjects && otherProjects.length > 0) {
          // Use explicit other_projects list with priority
          const sortedOtherProjects = [...otherProjects].sort((a, b) => a.priority - b.priority);
          filtered = sortedOtherProjects
            .map(op => allProjects.find(p => p.slug === op.slug))
            .filter((p): p is Project => p !== undefined)
            .slice(0, 3);
        } else {
          // Filter by same builder
          filtered = allProjects.filter(
            p => 
              p.builder.toLowerCase() === builder.toLowerCase() &&
              p.slug !== currentSlug &&
              !excludeProjects.includes(p.slug)
          ).slice(0, 3);
        }

        setProjects(filtered);
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    };

    loadProjects();
  }, [currentSlug, builder, otherProjects, excludeProjects]);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Other Projects by {builder}
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore more premium developments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project) => (
            <Card key={project.slug} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={project.heroImage}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{project.locality}</span>
                </div>
                {project.priceRange && (
                  <p className="text-accent font-semibold mb-4">
                    {project.priceRange}
                  </p>
                )}
                <Link to={`/projects/${project.slug}`}>
                  <Button className="w-full bg-primary hover:bg-primary-light text-primary-foreground font-semibold">
                    View Project
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuilderOtherProjects;
