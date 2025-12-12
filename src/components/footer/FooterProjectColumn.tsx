// src/components/footer/FooterProjectColumn.tsx
import { Link } from "react-router-dom";
import FooterAccordion from "./FooterAccordion";

export default function FooterProjectColumn({ project }) {
  if (!project) return null;

  const rera = project.rera;

  // Build correct URL: /builder-project
  const projectUrl = `/${project.builder}-${project.slug}`;

  return (
    <FooterAccordion
      title={
        <Link
          to={projectUrl}
          className="inline-flex items-center gap-2 !justify-start w-auto"
        >
          <span className="text-white text-lg font-semibold whitespace-nowrap">
            {project.projectName || project.name}
          </span>
        </Link>
      }
    >
      {/* Project Logo */}
      <div className="flex flex-col items-center md:items-start mb-4">
        {project.logo && (
          <img
            src={project.logo}
            className="h-14 mb-2 object-contain"
            alt={project.projectName || project.name}
          />
        )}
      </div>

      {/* Footer Navigation Links */}
      <ul className="space-y-1 text-gray-400 text-sm text-center md:text-left">
        {[
          "Hero",
          "Amenities",
          "Location UI",
          "FloorPlans",
          "Views",
          "Status",
          "Customer Speaks",
          "FAQ",
        ].map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              className="hover:text-white"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* RERA Section */}
      {rera?.reraId && (
        <div className="mt-5 text-sm text-gray-300">
          <p className="font-semibold mb-1 text-white">RERA Registration</p>

          {Array.isArray(rera.reraId) ? (
            <ul className="space-y-1 text-gray-400">
              {rera.reraId.map((id) => (
                <li key={id}>• {id}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">• {rera.reraId}</p>
          )}

          {rera.reraLink && (
            <a
              href={rera.reraLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline mt-2 inline-block"
            >
              View on Official RERA Website
            </a>
          )}
        </div>
      )}
    </FooterAccordion>
  );
}
