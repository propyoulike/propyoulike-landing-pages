import { Link } from "react-router-dom";

export default function LocalityOtherProjects({ projects = [] }) {
  if (!projects.length) return null;

  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">

        <h2 className="text-2xl font-bold mb-6">Nearby Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => {

            const videoId =
              typeof p.heroVideoId === "string" ? p.heroVideoId : null;

            const image =
              videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : (typeof p.heroImage === "string"
                    ? p.heroImage
                    : `https://picsum.photos/seed/${p.slug}/800/450`);

            const name = typeof p.name === "string" ? p.name : "";
            const slug = typeof p.slug === "string" ? p.slug : "#";

            const locality =
              typeof p.locality === "string" ? p.locality : "";
            const city =
              typeof p.city === "string" ? p.city : "";

            return (
              <Link
                key={i}
                to={`/${slug}`}
                className="block rounded-xl overflow-hidden bg-background border hover:border-primary shadow hover:shadow-lg transition"
              >
                <img src={image} className="w-full h-48 object-cover" />

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {locality} {locality && city ? "•" : ""} {city}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
