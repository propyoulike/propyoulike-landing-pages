import { Helmet } from "react-helmet-async";
import type { ProjectData } from "@/content/schema/project.schema";

import { resolveBreadcrumbs } from "@/components/seo/resolveBreadcrumbs";
import { buildBreadcrumbSchema } from "@/components/seo/buildBreadcrumbSchema";

/* ============================================================
   CONFIG
============================================================ */
const ORIGIN = "https://propyoulike.com";

function withTrailingSlash(url?: string) {
  if (!url) return url;
  return url.endsWith("/") ? url : `${url}/`;
}

interface SEOProps {
  project: ProjectData;
}

export default function ProjectSEO({ project }: SEOProps) {
  if (!project) return null;

  /* ============================================================
     CANONICAL (SINGLE SOURCE OF TRUTH)
  ============================================================ */
  const canonicalUrl = withTrailingSlash(
    `${ORIGIN}/${project.slug}`
  );

  /* ============================================================
     DESCRIPTION (USED IN SCHEMAS ONLY)
  ============================================================ */
  const city =
    project.locationMeta?.city ||
    project.city ||
    project.locationUI?.title?.split(",").pop()?.trim() ||
    "";

  const desc =
    project.summary?.description ||
    `Explore ${project.projectName} – pricing, floor plans, amenities, location and brochure.`;

  /* ============================================================
     FAQ JSON-LD
  ============================================================ */
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

  /* ============================================================
     PROJECT SCHEMA
  ============================================================ */
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: project.projectName,
    description: desc,
    url: canonicalUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "IN",
    },
    brand: project.builder,
  };

  /* ============================================================
     PRICING SCHEMA
  ============================================================ */
  const pricing = project.floorPlansSection?.unitPlans || [];

  const pricingSchema =
    pricing.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: project.projectName,
          url: canonicalUrl,
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

  /* ============================================================
     BREADCRUMB JSON-LD
  ============================================================ */
  const breadcrumbs = resolveBreadcrumbs({
    type: "project",
    project,
  });

const breadcrumbSchema = buildBreadcrumbSchema(
  breadcrumbs.map((b, idx) => {
    // Last breadcrumb = canonical URL
    if (idx === breadcrumbs.length - 1) {
      return {
        ...b,
        item: canonicalUrl,
      };
    }

    // Normalize ONLY if item exists
    if (typeof b.item === "string") {
      return {
        ...b,
        item: withTrailingSlash(b.item),
      };
    }

    // Otherwise, return as-is (no crash)
    return b;
  })
);

  /* ============================================================
     HEAD OUTPUT
  ============================================================ */
  return (
    <Helmet>
      {/* ===== Canonical hard-lock ===== */}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />

      {/* ===== JSON-LD ONLY ===== */}
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
