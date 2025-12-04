import { Link } from "react-router-dom";

interface BuilderOtherProjectsProps {
  projects?: Array<{
    name: string;
    slug: string;
    location?: string;
    status?: string;
  }>;
}

export default function BuilderOtherProjects({ projects = [] }: BuilderOtherProjectsProps) {
  if (!projects.length) return null;

  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Other Projects by the Builder</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <Link
              key={i}
              to={`/project/${p.slug}`}
              className="p-6 rounded-xl shadow bg-background hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{p.name}</h3>
              {p.location && (
                <p className="text-sm text-muted-foreground">{p.location}</p>
              )}
              {p.status && (
                <p className="text-xs mt-2 font-medium uppercase">{p.status}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
