import { Helmet } from "react-helmet-async";
import type { ProjectData } from "@/content/schema/project.schema";

import { resolveBreadcrumbs } from "@/components/seo/resolveBreadcrumbs";
import { buildBreadcrumbSchema } from "@/components/seo/buildBreadcrumbSchema";

interface SEOProps {
  project: ProjectData;
}

const ORIGIN = "https://propyoulike.com";

export default function ProjectSEO({ project }: SEOProps) {
  if (!project) return null;

/* -----------------------------------------------
    URL & CANONICAL (LOCKED)
----------------------------------------------- */
const canonicalSlug = `${project.builder}-${project.slug}`;
const url = `${ORIGIN}/${canonicalSlug}`;

  /* -----------------------------------------------
      TITLE + DESCRIPTION
  ----------------------------------------------- */
  const city =
    project.locationMeta?.city ||
    project.city ||
    project.locationUI?.title?.split(",").pop()?.trim() ||
    "";

  const title = `${project.projectName}${
    city ? " | " + city : ""
  } | Price, Floor Plans, Brochure`;

  const desc =
    project.summary?.description ||
    `Explore ${project.projectName} – pricing, floor plans, amenities, location and brochure.`;

  /* -----------------------------------------------
      OG IMAGE (AUTO-GENERATED)
  ----------------------------------------------- */
  const ogImage = `https://og.propyoulike.com/${canonicalSlug}.png`;

  /* -----------------------------------------------
      FAQ JSON-LD
  ----------------------------------------------- */
const faqList = Array.isArray(project.faq?.items)
  ? project.faq.items
  : [];

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
    image: ogImage,
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
      BREADCRUMB JSON-LD (SINGLE SOURCE)
  ----------------------------------------------- */
  const breadcrumbs = resolveBreadcrumbs({
    type: "project",
    project,
  });

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />

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
