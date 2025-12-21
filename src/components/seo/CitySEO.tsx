// src/components/seo/CitySEO.tsx

import { Helmet } from "react-helmet-async";

const ORIGIN = "https://propyoulike.com";

export default function CitySEO({ city, projects }: any) {
  const title = `Apartments in ${city} | Price & Projects`;
  const desc = `Explore ${projects.length} residential projects in ${city}.`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={`${ORIGIN}/${city}`} />
    </Helmet>
  );
}
