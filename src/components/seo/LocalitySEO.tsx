// src/components/seo/LocalitySEO.tsx

import { Helmet } from "react-helmet-async";

const ORIGIN = "https://propyoulike.com";

export default function LocalitySEO({
  city,
  locality,
  projects,
}: any) {
  const title = `Apartments in ${locality}, ${city} | Price & Projects`;
  const desc = `Explore ${projects.length} residential projects in ${locality}, ${city}.`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link
        rel="canonical"
        href={`${ORIGIN}/${city}/${locality}`}
      />
    </Helmet>
  );
}
