import { Helmet } from "react-helmet-async";
import type { ProjectData } from "@/content/schema/project.schema";

import { resolveBreadcrumbs } from "@/components/seo/resolveBreadcrumbs";
import { buildBreadcrumbSchema } from "@/components/seo/buildBreadcrumbSchema";

interface SEOProps {
  project: ProjectData;
}

export default function ProjectSEO({ project }: SEOProps) {
  if (!project) return null;

  /* -----------------------------------------------
      DESCRIPTION (USED IN SCHEMAS ONLY)
  ----------------------------------------------- */
  const city =
    project.locationMeta?.city ||
    project.city ||
    project.locationUI?.title?.split(",").pop()?.trim() ||
    "";

  const desc =
    project.summary?.description ||
    `Explore ${project.projectName} – pricing, floor plans, amenities, location and brochure.`;

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
    description: desc,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "IN",
    },
    brand: project.builder,
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
      BREADCRUMB JSON-LD
  ----------------------------------------------- */
  const breadcrumbs = resolveBreadcrumbs({
    type: "project",
    project,
  });

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <Helmet>
      {/* JSON-LD ONLY — NO META TAGS */}

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
