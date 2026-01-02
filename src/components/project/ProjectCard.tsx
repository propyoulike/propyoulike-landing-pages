import { Link } from "react-router-dom";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import { useState } from "react";
import { cfImage } from "@/lib/media/cloudflareImage";

/* ============================================================
   CTA MESSAGE MAP
============================================================ */

const CTA_MESSAGES = {
  site_visit: (projectName: string) =>
    `I want to schedule a site visit for ${projectName}. Please call me to confirm.`,
  pricing: (projectName: string) =>
    `I'm interested in the pricing for ${projectName}. Please share the best offers.`,
  brochure: (projectName: string) =>
    `Please send the brochure for ${projectName}.`,
};

/* ============================================================
   TYPES
============================================================ */

interface ProjectCardProps {
  project: any;
  variant?: "default" | "homepage";
}

/* ============================================================
   IMAGE PROXY (Cloudflare Worker)
   - Prevents CORS / hotlink blocks
   - Origin-agnostic
============================================================ */

function proxifyImage(url?: string | null) {
  if (!url) return null;
  return `https://image-proxy.propyoulike.workers.dev/${encodeURIComponent(
    url
  )}`;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function ProjectCard({
  project,
  variant = "default",
}: ProjectCardProps) {
  if (!project) return null;

  const { openCTA } = useLeadCTAContext();

  const {
    slug,
    publicSlug,
    projectName,
    heroImage,
    heroVideoId,
    type,
    status,
    minPrice,
    minSize,
    config,
    city,
    locality,
  } = project;

  /* ---------------- HARD GUARD ---------------- */
  if (!publicSlug) {
    console.error("❌ Project missing publicSlug", project);
    return null;
  }

  const name = projectName || "Unnamed Project";

  /* ---------------- Label normalizer ---------------- */
  function formatLabel(value?: string) {
    if (!value) return null;
    return value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  /* ---------------- Image sources ---------------- */
  const youtubeThumb = heroVideoId
    ? proxifyImage(
        `https://img.youtube.com/vi/${heroVideoId}/hqdefault.jpg`
      )
    : null;

  const [imgSrc, setImgSrc] = useState<string | null>(
    proxifyImage(heroImage) || youtubeThumb
  );

  /* ---------------- Location ---------------- */
  const location =
    locality && city ? `${locality}, ${city}` : city || "";

  /* ---------------- CTA handler ---------------- */
  function handleOpenCTA(typeKey: keyof typeof CTA_MESSAGES) {
    const label = `${typeKey}_${slug || publicSlug}`;
    const message = CTA_MESSAGES[typeKey](name);
    openCTA(label, message);
  }

  /* ---------------- Image sizing rules ---------------- */
  const imageWidth = variant === "homepage" ? 640 : 800;
  const imageHeight = 192;

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="rounded-xl overflow-hidden bg-background border shadow hover:shadow-lg transition group">
      {/* =================================================
         IMAGE
      ================================================== */}
      {imgSrc ? (
        <div className="relative">
          <img
            src={cfImage(imgSrc, {
              width: imageWidth,
              quality: 75,
            })}
            alt={name}
            width={imageWidth}
            height={imageHeight}
            className="w-full h-48 object-cover"
            loading={variant === "homepage" ? "lazy" : "eager"}
            decoding="async"
            fetchpriority={variant === "homepage" ? "auto" : "high"}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => {
              if (imgSrc !== youtubeThumb && youtubeThumb) {
                setImgSrc(youtubeThumb);
              } else {
                setImgSrc(null);
              }
            }}
          />

          {/* Badges (default variant only) */}
          {variant === "default" && type && (
            <span className="absolute top-2 left-2 bg-background/80 text-xs font-semibold px-3 py-1 rounded">
              {formatLabel(type)}
            </span>
          )}

          {variant === "default" && status && (
            <span className="absolute bottom-2 right-2 bg-primary text-white text-xs px-3 py-1 rounded shadow">
              {formatLabel(status)}
            </span>
          )}
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center bg-muted text-xs text-muted-foreground">
          Image coming soon
        </div>
      )}

      {/* =================================================
         CONTENT
      ================================================== */}
      <div className="p-4">
        <h3 className="text-lg font-semibold leading-snug">
          {name}
        </h3>

        {/* TYPE + STATUS (HOMEPAGE) */}
        {variant === "homepage" && (type || status) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {type && (
              <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                {formatLabel(type)}
              </span>
            )}
            {status && (
              <span className="text-xs px-2 py-1 rounded-md border text-muted-foreground">
                {formatLabel(status)}
              </span>
            )}
          </div>
        )}

        {location && (
          <p className="mt-2 text-sm text-muted-foreground">
            {location}
          </p>
        )}

        {/* =================================================
           LISTING / BUILDER PAGE
        ================================================== */}
        {variant === "default" && (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm my-3">
              <div>
                <p className="font-semibold">Price</p>
                <p className="text-muted-foreground">
                  {minPrice || "On Request"}
                </p>
              </div>

              <div>
                <p className="font-semibold">Unit Size</p>
                <p className="text-muted-foreground">
                  {minSize || "NA"}
                </p>
              </div>

              <div>
                <p className="font-semibold">BHK</p>
                <p className="text-muted-foreground">
                  {config || "NA"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/${publicSlug}`}
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
          </>
        )}

        {/* =================================================
           HOMEPAGE VARIANT
        ================================================== */}
        {variant === "homepage" && (
          <div className="pt-4">
            <Link
              to={`/${publicSlug}`}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition"
            >
              View Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
