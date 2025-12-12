// src/components/footer/FooterBuilderColumn.tsx
import { Link } from "react-router-dom";
import FooterAccordion from "./FooterAccordion";

export default function FooterBuilderColumn({ builder }) {

  if (!builder || typeof builder !== "object") {
    console.warn("⚠ FooterBuilderColumn: Builder data is missing or invalid. Received:", builder);
    return (
      <FooterAccordion title="Builder">
        <p className="text-gray-400 text-sm">Builder information unavailable.</p>
      </FooterAccordion>
    );
  }

  // Extract experience from stats
  const experienceStat = builder.stats?.find((s) =>
    s.label?.toLowerCase().includes("experience")
  );

  return (
    <FooterAccordion
      title={
        <div className="inline-flex items-center gap-2">
          {builder.logo && (
            <img
              src={builder.logo}
              alt={builder.name}
              className="h-6 object-contain"
            />
          )}

          <Link
            to={`/builders/${builder.slug}`}
            className="text-white text-lg font-semibold whitespace-nowrap"
          >
            {builder.name}
          </Link>
        </div>
      }
    >
      {/* Subtitle */}
      {builder.subtitle && (
        <p className="text-gray-400 text-sm mb-3">{builder.subtitle}</p>
      )}

      {/* Short Description */}
      {builder.description && (
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          {builder.description}
        </p>
      )}

      {/* Experience */}
      {experienceStat?.value && (
        <p className="text-gray-300 text-sm mb-3">
          {experienceStat.value} Years Experience
        </p>
      )}

      {/* Badges */}
      {builder.badges?.length > 0 ? (
        <div className="mb-4">
          <p className="text-gray-300 font-semibold text-sm mb-2">
            Trusted For:
          </p>

          <ul className="text-gray-400 text-sm space-y-1">
            {builder.badges.map((badge, i) => (
              <li key={i}>• {badge}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No badges available.</p>
      )}

    </FooterAccordion>
  );
}
