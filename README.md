# PropYouLike - Landing Page Builder System

A complete production-grade landing page builder for real estate projects with dynamic templates, builder themes, widgets, and social sharing optimization.

## 🚀 Features

- **Dynamic Template System**: Default + builder-specific templates
- **Theme Engine**: Customizable themes per builder
- **Smart Widgets**: Auto-populated builder & locality project recommendations
- **Social Sharing**: OG thumbnails with pre-rendering for WhatsApp, Facebook, etc.
- **SEO Optimized**: Meta tags, structured data, semantic HTML
- **Tracking Integration**: GA4, Google Ads, Meta Pixel
- **BigRock Ready**: Static hosting with proper .htaccess configuration

## 📁 Project Structure

```
src/
├── templates/
│   ├── default/              # Default templates
│   │   ├── ApartmentDefault.tsx
│   │   ├── VillaDefault.tsx
│   │   └── PlotDefault.tsx
│   ├── builders/             # Builder-specific templates
│   │   └── provident/
│   │       ├── ApartmentProvident.tsx
│   │       ├── VillaProvident.tsx
│   │       └── PlotProvident.tsx
│   └── common/               # Reusable components
│       ├── Hero.tsx
│       ├── Gallery.tsx
│       ├── Amenities.tsx
│       └── ...
├── themes/
│   ├── default.css
│   └── builders/
│       ├── provident.css
│       ├── prestige.css
│       └── ...
├── components/
│   ├── Widgets/
│   │   ├── BuilderOtherProjects.tsx
│   │   └── LocalityOtherProjects.tsx
│   └── Footer/
│       └── Footer.tsx
├── content/
│   └── projects/
│       ├── provident-sunworth-city.json
│       └── ...
└── data/
    └── projects-index.json
```

## 🎨 Adding a New Project

1. Create a JSON file in `src/content/projects/[slug].json`
2. Add project images to `public/projects/[slug]/`
3. Run the index generator: `node scripts/generate-projects-index.js`
4. Build and pre-render: `npm run build && node scripts/generate-prerender-pages.js`

### Example Project JSON

```json
{
  "slug": "project-name",
  "type": "apartment",
  "builder": "Provident",
  "template": "custom",
  "theme": "custom",
  "locality": "Hebbal",
  "city": "Bangalore",
  "name": "Project Name",
  "tagline": "Your tagline here",
  "description": "Project description",
  "heroImage": "/projects/project-name/hero.jpg",
  "ogImage": "/projects/project-name/og-image-1200x630.jpg",
  "configurations": [...],
  "amenities": [...],
  "gallery": [...],
  "locationMap": {...},
  "faq": [...]
}
```

## 🏗️ Adding a New Builder

1. Create template files in `src/templates/builders/[builder-name]/`
2. Create theme CSS in `src/themes/builders/[builder-name].css`
3. Update `BuilderTemplates` object in `src/pages/ProjectPage.tsx`

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `node scripts/generate-projects-index.js` - Generate project index
- `node scripts/generate-prerender-pages.js` - Pre-render OG meta tags

## 🌐 Deployment to BigRock

1. Build the project: `npm run build`
2. Run pre-render script: `node scripts/generate-prerender-pages.js`
3. Upload `dist/` contents to `public_html` via FTP
4. Ensure `.htaccess` is in place for routing

## 📱 Social Sharing

The system automatically generates proper OG meta tags for each project page:
- Open Graph images (1200x630)
- Video preview support
- Platform-specific tags (Facebook, Twitter, WhatsApp)

## 🎯 Widget System

### Builder Projects Widget
Shows other projects by the same builder. Priority:
1. Explicit `other_projects` list in JSON
2. Auto-filter by builder from projects-index

### Locality Projects Widget
Shows projects in the same area. Fallback:
1. Same locality
2. Same builder (if < 2 locality matches)

## 🎨 Design System

All styling uses the design system defined in:
- `src/index.css` - CSS variables and tokens
- `tailwind.config.ts` - Tailwind configuration

Colors are HSL-based with semantic tokens:
- `--primary` - Main brand color (deep navy)
- `--accent` - CTA color (gold)
- `--muted` - Subtle backgrounds

## 📊 Tracking

Integrated tracking:
- **Google Analytics 4**: G-YZLLC4DES1, GT-K8FLQF8H
- **Google Ads**: AW-17754016716, GT-T9KB44PR
- **Facebook Pixel**: 1080640150838893

## 🔒 SEO Features

- Semantic HTML structure
- Meta descriptions per page
- Structured data ready
- Mobile-optimized
- Fast loading with lazy images

## 📞 Support

For questions or issues, contact PropYouLike technical team.

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and Vite
