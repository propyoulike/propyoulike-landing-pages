import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  if (!project) return null;

  const {
    slug,
    name,
    heroImage,
    location,
    builder,
  } = project;

  return (
    <Link
      to={`/project/${slug}`}
      className="block rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition"
    >
      {/* Hero Image */}
      <div className="aspect-video bg-gray-100">
        {heroImage ? (
          <img
            src={heroImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-lg">{name}</h3>

        {builder && (
          <p className="text-sm text-gray-600 capitalize">
            By {builder}
          </p>
        )}

        {location && (
          <p className="text-sm text-gray-500">{location}</p>
        )}
      </div>
    </Link>
  );
}
