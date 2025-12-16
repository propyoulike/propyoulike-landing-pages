import { Helmet } from "react-helmet-async";
import type { ProjectData } from "@/content/schema/project.schema";

interface SEOProps {
  project: ProjectData;
}

const ORIGIN = "https://propyoulike.com";
const DEFAULT_OG_IMAGE = "/images/og-default.jpg";

export default function ProjectSEO({ project }: SEOProps) {
  if (!project) return null;

  /* -----------------------------------------------
      URL & CANONICAL
  ----------------------------------------------- */
  const url = `${ORIGIN}/${project.slug}`;

  /* -----------------------------------------------
      TITLE + DESCRIPTION
  ----------------------------------------------- */
  const city =
    project.locationMeta?.city ||
    project.city ||
    project.locationUI?.title?.split(",").pop()?.trim() ||
    "";

  const title = `${project.projectName}${city ? " | " + city : ""} | Price, Floor Plans, Brochure`;

  const desc =
    project.summary?.description ||
    `Explore ${project.projectName} – pricing, floor plans, amenities, location and brochure.`;

  /* -----------------------------------------------
      HERO IMAGE (SAFE, LOCAL, OPTIONAL)
  ----------------------------------------------- */
  const heroImage =
    project.hero?.images?.[0] ||
    project.brochure?.coverImage ||
    DEFAULT_OG_IMAGE;

  /* -----------------------------------------------
      FAQ JSON-LD
  ----------------------------------------------- */
  const faqList = Array.isArray(project.faq) ? project.faq : [];

  const faqSchema =
    faqList.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqList.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  /* -----------------------------------------------
      PROJECT SCHEMA
  ----------------------------------------------- */
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: project.projectName,
    url,
    image: heroImage,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "IN",
    },
    brand: project.builder,
    description: desc,
  };

  /* -----------------------------------------------
      PRICING SCHEMA
  ----------------------------------------------- */
  const pricing = project.floorPlansSection?.unitPlans || [];

  const pricingSchema =
    pricing.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: project.projectName,
          brand: project.builder,
          offers: pricing.map((p) => ({
            "@type": "Offer",
            priceCurrency: "INR",
            price: p.price || undefined,
            description: p.title || "",
            availability: "https://schema.org/InStock",
          })),
        }
      : null;

  /* -----------------------------------------------
      BREADCRUMB SCHEMA
  ----------------------------------------------- */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: ORIGIN,
      },
      city && {
        "@type": "ListItem",
        position: 2,
        name: city,
        item: `${ORIGIN}/${encodeURIComponent(city)}`,
      },
      {
        "@type": "ListItem",
        position: city ? 3 : 2,
        name: project.projectName,
        item: url,
      },
    ].filter(Boolean),
  };

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      {heroImage && <meta property="og:image" content={heroImage} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />

      {/* Preload ONLY real image */}
      {heroImage && (
        <link rel="preload" as="image" href={heroImage} fetchPriority="high" />
      )}

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(projectSchema)}
      </script>

      {pricingSchema && (
        <script type="application/ld+json">
          {JSON.stringify(pricingSchema)}
        </script>
      )}

      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}
