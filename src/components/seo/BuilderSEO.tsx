// src/components/seo/BuilderSEO.tsx

import { Helmet } from "react-helmet-async";

interface BuilderSEOProps {
  builder: string;
  projects?: any[];
}

const ORIGIN = "https://propyoulike.com";

export default function BuilderSEO({
  builder,
  projects = [],
}: BuilderSEOProps) {
  const title = `${builder} Projects | New Launches, Prices & Floor Plans`;
  const description = `Explore residential projects by ${builder}. View latest prices, floor plans, amenities, locations and more.`;

  const url = `${ORIGIN}/builder/${builder}`;

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

      {/* Optional keywords / signals */}
      {projects.length > 0 && (
        <meta
          name="keywords"
          content={`${builder} projects, ${projects.length} residential projects`}
        />
      )}
    </Helmet>
  );
}
