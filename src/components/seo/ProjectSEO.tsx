import { Helmet } from "react-helmet-async";
import type { ProjectData } from "@/content/schema/project.schema";

interface SEOProps {
  project: ProjectData;
}

export default function ProjectSEO({ project }: SEOProps) {
  if (!project) return null;

  /* -----------------------------------------------
      URL & CANONICAL
  ----------------------------------------------- */
  const origin = "https://propyoulike.com";
  const url = `${origin}/${project.slug}`;

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
      HERO IMAGE FALLBACK
  ----------------------------------------------- */
  const heroImage =
    project.hero?.images?.[0] ||
    project.heroImage ||
    "https://via.placeholder.com/1200x630?text=Project+Image";

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
      PROJECT SCHEMA (ApartmentComplex)
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
      PRICING SCHEMA SAFELY
  ----------------------------------------------- */
  const pricing = project.floorPlansSection?.unitPlans || [];

  const pricingSchema =
    Array.isArray(pricing) && pricing.length > 0
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
      BREADCRUMB SCHEMA (City → Project)
  ----------------------------------------------- */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: origin,
      },
      city
        ? {
            "@type": "ListItem",
            position: 2,
            name: city,
            item: `${origin}/${encodeURIComponent(city)}`,
          }
        : null,
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
      <meta property="og:image" content={heroImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />

      {/* Preload hero image */}
      {heroImage && <link rel="preload" as="image" href={heroImage} fetchPriority="high" />}

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
