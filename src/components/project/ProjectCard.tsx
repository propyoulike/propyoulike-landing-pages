import { Link } from "react-router-dom";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";

const CTA_MESSAGES = {
  site_visit: (projectName: string) =>
    `I want to schedule a site visit for ${projectName}. Please call me to confirm.`,
  pricing: (projectName: string) =>
    `I'm interested in the pricing for ${projectName}. Please share the best offers.`,
  brochure: (projectName: string) =>
    `Please send the brochure for ${projectName}.`,
  floorplans: (projectName: string) =>
    `Please share available floor plans for ${projectName}.`,
  availability: (projectName: string) =>
    `Please check available units for ${projectName}.`,
};

export default function ProjectCard({ project }: { project: any }) {
  if (!project) return null;

  const { openCTA } = useLeadCTAContext();

  const {
    slug,
    name,
    heroImage,
    heroVideoId,
    type,
    status,
    locationMeta,
    minPrice,
    minSize,
    config, // BHK string like "2, 3 & 4 BHK"
  } = project;

  // Compute final image
  const img = heroVideoId
    ? `https://img.youtube.com/vi/${heroVideoId}/hqdefault.jpg`
    : heroImage || `https://picsum.photos/seed/${slug}/800/450`;

// Build universal location string (supports both locationMeta and direct fields)
const loc = locationMeta || project;

// Build "Zone City" without comma if both exist
const zoneCity = loc.zone && loc.city ? `${loc.zone} ${loc.city}` : loc.zone || loc.city;

  // Build location string
  const location = [
  loc.area,
  loc.locality,
  zoneCity,
  ]
    .filter(Boolean)
    .join(", ");

  // Helper to open CTA with a preset message
  function handleOpenCTA(typeKey: keyof typeof CTA_MESSAGES) {
    const label = `${typeKey}_${slug}`;
    const message = CTA_MESSAGES[typeKey](name || "this project");
    openCTA(label, message);
  }

  return (
    <div className="rounded-xl overflow-hidden bg-background border shadow hover:shadow-lg transition group">
      {/* Image */}
      <div className="relative">
        <img src={img} alt={name} className="w-full h-48 object-cover" />

        {type && (
          <span className="absolute top-2 left-2 bg-background/80 text-xs font-semibold px-3 py-1 rounded">
            {type}
          </span>
        )}

        {status && (
          <span className="absolute bottom-2 right-2 bg-primary text-white text-xs px-3 py-1 rounded shadow">
            {status}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold group-hover:text-primary transition">
          {name}
        </h3>

        {location && (
          <p className="text-sm text-muted-foreground mb-3">{location}</p>
        )}

        {/* Price + Size + BHK */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <p className="font-semibold">Price</p>
            <p className="text-muted-foreground">{minPrice || "On Request"}</p>
          </div>

          <div>
            <p className="font-semibold">Unit Size</p>
            <p className="text-muted-foreground">{minSize || "NA"}</p>
          </div>

          <div>
            <p className="font-semibold">BHK</p>
            <p className="text-muted-foreground">{config || "NA"}</p>
          </div>

          <div></div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Link
            to={`/${slug}`}
            className="flex-1 text-center bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            View Project
          </Link>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleOpenCTA("site_visit");
            }}
            className="flex-1 text-center border border-primary text-primary py-2 rounded-lg text-sm font-medium hover:bg-primary/5"
          >
            Site Visit
          </button>
        </div>

        {/* Optional small links for other CTAs (uncomment if you want them) */}
        {/* <div className="mt-3 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleOpenCTA("pricing");
            }}
            className="text-xs underline text-muted-foreground"
          >
            Pricing
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleOpenCTA("brochure");
            }}
            className="text-xs underline text-muted-foreground"
          >
            Brochure
          </button>
        </div> */}
      </div>
    </div>
  );
}
