// src/components/seo/ZoneSEO.tsx

import { Helmet } from "react-helmet-async";

interface ZoneSEOProps {
  city: string;
  zone: string;
  projects?: any[];
}

const ORIGIN = "https://propyoulike.com";

export default function ZoneSEO({
  city,
  zone,
  projects = [],
}: ZoneSEOProps) {
  const title = `${zone} Projects in ${city} | New Launches & Prices`;
  const description = `Explore new residential projects in ${zone}, ${city}. View prices, floor plans, amenities, location details and more.`;

  const url = `${ORIGIN}/${city}/${zone}`;

  return (
    <Helmet>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />

      {/* Optional count signal */}
      {projects.length > 0 && (
        <meta
          name="keywords"
          content={`Projects in ${zone}, ${city}, ${projects.length} new launches`}
        />
      )}
    </Helmet>
  );
}
