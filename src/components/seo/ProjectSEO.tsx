import { Helmet } from "react-helmet-async";
import type { ProjectData } from "@/content/schema/project.schema";

interface SEOProps {
  project: ProjectData;
}

export default function ProjectSEO({ project }: SEOProps) {
  const url = `https://propyoulike.com/${project.builder}-${project.slug}`;

  /* -----------------------------------------------
      SAFE FALLBACKS
  ----------------------------------------------- */
  const locationUI = project.locationUI;
  const city = locationUI?.title?.split(",").pop()?.trim() || "";

  const title = `${project.projectName}${
    city ? " | " + city : ""
  } | Price, Floor Plans, Brochure`;

  const desc =
    project.summary?.description ||
    `Explore ${project.projectName} – pricing, floor plans, amenities, location and brochure.`;

  const heroImage = project.hero?.images?.[0] || "/default-og.jpg";

  /* -----------------------------------------------
      SAFE FAQ RESOLVER
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
    amenityFeature:
      project.amenities?.amenityCategories?.flatMap((c) =>
        c.items.map((item) => ({
          "@type": "LocationFeatureSpecification",
          name: item,
        }))
      ) || [],
  };

  /* -----------------------------------------------
      PRICING SCHEMA (SAFE)
  ----------------------------------------------- */
  const pricingList = project.floorPlansSection?.unitPlans || [];

  const pricingSchema =
    pricingList.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: project.projectName,
          brand: project.builder,
          offers: pricingList.map((conf) => ({
            "@type": "Offer",
            priceCurrency: "INR",
            price: conf.price,
            description: conf.title,
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
        name: "Projects",
        item: "https://yourdomain.com/projects",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: project.builder,
        item: `https://yourdomain.com/projects/${project.builder}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.projectName,
        item: url,
      },
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{title}</title>
      <meta name="description" content={desc} />

      <link rel="canonical" href={url} />

      {/* OG */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={heroImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />

      {/* Preload hero */}
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
