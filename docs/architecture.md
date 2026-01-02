# ARCHITECTURE.md

## 1. Purpose
This document defines the canonical architecture for Propyoulike: routing, content model, loader APIs, SEO, sitemaps, search indexing, deployment, and developer workflows. Follow this to keep the codebase consistent and scalable.

---
## 2. Goals
- Stable, collision-free routing and URL strategy
- Single source of truth for content (`src/content`)
- SEO-first pages (JSON-LD, canonical, OG)
- Simple loader API for pages & widgets
- Scalable search & sitemap generation for SEO discovery
- Developer-friendly layout and CI automation

---
## 3. Canonical Routing (final)
Registered in this order inside `src/App.tsx`:
```
/                        -> Index (Home)
/builder/:builder        -> BuilderPage
/locality/:locality      -> LocalityPage
/:city/:zone             -> ZonePage
/:slug                   -> DynamicRouter (project OR city)
*                        -> NotFound
```
Notes:
- `/:slug` resolved via `isProjectSlug(slug)`.
- Explicit routes always come before dynamic ones.

---
## 4. URL Strategy
- Project: `https://propyoulike.com/:slug`
- City: `https://propyoulike.com/:city`
- Zone: `https://propyoulike.com/:city/:zone`
- Builder: `https://propyoulike.com/builder/:builder`
- Locality: `https://propyoulike.com/locality/:locality`

---
## 5. Content: File Layout
```
src/content/
  projects/
    <builder>/
      <project-slug>/
        index.json
        hero.json
        floor-plans.json
        faq.json
        ...other JSON files
  builders/
    <builder>.json
  global/
    globalFiles.json
    globalSections.json
    globalNavbar.json
```
Rules:
- `index.json` is required for every project.
- Location metadata must go inside `locationMeta`.
- Prefer CDN images.

---
## 6. Project Schema (canonical excerpt)
```ts
export interface ProjectData {
  slug: string;
  builder: string;
  projectName: string;
  locationMeta?: {
    area?: string;
    locality?: string;
    zone?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  locationUI?: { title?: string; coords?: { lat: number; lng: number } };
  hero?: { images?: string[]; videoId?: string; image?: string };
  sections?: string[];
  files?: Record<string, string>;
  navbarConfig?: any;
  amenities?: any;
  floorPlansSection?: { unitPlans?: any[] };
  faq?: { question: string; answer: string }[];
  seo?: { metaTitle?: string; metaDescription?: string; canonical?: string; ogImage?: string };
  type?: string;
}
```

---
## 7. Loader API (`src/lib/data/loadProject.ts`)
Expose:
```ts
loadProject(slug: string): Promise<ProjectData | null>;
getProjectsByCity(city: string): ProjectMeta[];
getProjectsByZone(city: string, zone: string): ProjectMeta[];
isProjectSlug(slug: string): boolean;
getProjectMeta(slug: string): ProjectMeta | null;
allProjectMetas: ProjectMeta[];
```
Notes:
- Merges global → builder → project JSON.
- Auto-loads referenced files.
- Returns `builderProjects` + locality-based recommendations.

---
## 8. Pages & Components
```
src/pages/
  Index.tsx
  ProjectPage.tsx
  CityPage.tsx
  ZonePage.tsx
  BuilderPage.tsx
  LocalityPage.tsx
  DynamicRouter.tsx
src/components/
  project/ProjectCard.tsx
  seo/SEO.tsx
  seo/ProjectSEO.tsx
  navigation/Breadcrumbs.tsx
  lead/LeadCTAProvider.tsx
src/templates/
  common/*
  builders/<builder>/*
```
Guidelines:
- `ProjectSEO` must be used on project pages.
- Generic `SEO` used on city/zone/locality/builder pages.

---
## 9. SEO & Structured Data
`ProjectSEO` includes:
- JSON-LD: `BreadcrumbList`, `FAQPage`, `ApartmentComplex`, `Product` + `Offer`.
- Canonical tags.
- OG Tags.
- Preload hero image.

Other pages use generic `<SEO>`.

---
## 10. Breadcrumbs & Internal Linking
Breadcrumb patterns:
- Project: `Home › City › Zone › Project`
- Zone: `Home › City › Zone`
- Builder: `Home › Builders › BuilderName`

Breadcrumb JSON-LD included in `ProjectSEO`.

---
## 11. Sitemaps
Generated via `scripts/generate-sitemap.js`:
- `/sitemap.xml` (index)
- `/sitemap-projects.xml`
- `/sitemap-locations.xml`
- `/sitemap-builders.xml`

`robots.txt` must include:
```
Sitemap: https://propyoulike.com/sitemap.xml
```

---
## 12. Search Indexing
Options:
### Local index (≤10k docs)
- Use FlexSearch/Lunr to build `search-index.json` at build time.

### Hosted (recommended)
- Algolia / Meilisearch / Typesense.
- Sync fields: slug, name, builder, city, zone, locality, priceRange, amenities.

---
## 13. Caching & Data Fetching
Use React Query:
```ts
useProject(slug) → ["project", slug]
useProjectsByCity(city) → ["projects-city", city]
```
- staleTime: 24h
- cacheTime: 24h

---
## 14. Images & Media
- OG: 1200×630
- Use `loading="lazy"` for all non-hero images.
- Preload hero image via `<link rel="preload">`.

---
## 15. Performance & Core Web Vitals
- Code split templates using dynamic imports.
- Avoid heavy JS on city/zone pages.
- Use CDN for images.
- Lighthouse monitoring in CI.

---
## 16. Testing
### Unit: Jest + RTL
- Breadcrumbs
- ProjectCard
- SEO meta blocks

### E2E: Playwright
- Home → City → Project
- Builder navigation

### Content Validation
Run Zod against all JSON in CI.

---
## 17. CI / Deployment
### Steps:
1. Install
2. Lint & typecheck
3. Test
4. Build
5. `node scripts/generate-sitemap.js`
6. Deploy

Optional:
- Algolia indexing job.

---
## 18. Developer Workflows
- `npm run dev`
- `npm run build`
- `node scripts/generate-sitemap.js`
- `node scripts/validate-content.js`

Rules:
- Never edit SEO manually in pages—use `<SEO>` or `<ProjectSEO>`.
- All content changes must occur in `src/content/`.

---
## 19. Conventions
- Slug uniqueness is critical: use `builder-innerSlug`.
- Folder names must be lowercase.
- Use kebab-case for slugs.
- No inline Helmet tags outside canonical SEO components.
- Route order is sacred—document if changed.

---
## 20. Example `index.json`
```json
{
  "slug": "sunworth-city",
  "builder": "provident",
  "projectName": "Provident Sunworth City",
  "type": "apartment",
  "locationMeta": {
    "area": "Electronic City",
    "locality": "Bommasandra",
    "zone": "south",
    "city": "bangalore",
    "state": "karnataka",
    "country": "india"
  },
  "hero": {
    "images": ["https://cdn.example.com/provident/sunworth/hero.jpg"]
  },
  "summary": {
    "description": "Provident Sunworth City is a modern residential township..."
  },
  "floorPlansSection": {
    "unitPlans": [
      { "title": "2 BHK", "price": 5500000 },
      { "title": "3 BHK", "price": 7500000 }
    ]
  },
  "faq": [
    { "question": "What is the possession date?", "answer": "June 2026" }
  ],
  "seo": {
    "metaTitle": "Provident Sunworth City - Apartments in Bangalore",
    "metaDescription": "Explore plans, price and brochure for Provident Sunworth City."
  }
}
```

---
## 21. Roadmap
### Phase 0: Stabilize (now)
- Add Architecture.md (this document)
- Confirm route system
- Confirm loader exports

### Phase 1: SEO & Sitemaps
- Add City/Zone/Builder SEO
- Finalize sitemap generator

### Phase 2: Search
- Implement local or hosted indexing
- UI search component

### Phase 3: Performance & Testing
- CDN optimization
- Lighthouse CI
- Add tests

---
## 22. Ownership
- Owner: Pankaj / Engineering Lead
- Repo: propyoulike-pages
- Keep this file updated with architectural changes.

---
# END OF ARCHITECTURE DOCUMENT
