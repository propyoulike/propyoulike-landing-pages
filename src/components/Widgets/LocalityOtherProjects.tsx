import { Link } from "react-router-dom";

interface LocalityOtherProjectsProps {
  projects?: Array<{
    name: string;
    slug: string;
    builder?: string;
    price?: string;
    status?: string;
  }>;
}

export default function LocalityOtherProjects({ projects = [] }: LocalityOtherProjectsProps) {
  if (!projects.length) return null;

  return (
    <section className="py-12 bg-muted/60">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Other Projects in This Locality</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <Link
              key={i}
              to={`/project/${p.slug}`}
              className="block p-6 rounded-xl bg-background shadow hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold">{p.name}</h3>

              {p.builder && (
                <p className="text-sm text-muted-foreground">By {p.builder}</p>
              )}

              {p.price && (
                <p className="text-sm font-medium mt-2">Starting {p.price}</p>
              )}

              {p.status && (
                <p className="text-xs mt-2 uppercase text-muted-foreground">
                  {p.status}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
