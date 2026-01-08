export function applySectionAdapter(
  sectionId: string,
  resolved: any,
  ctx: any
) {
  switch (sectionId) {
    case "google-reviews": {
      const gr = resolved?.googleReviews;

      if (!gr?.enabled) return null;

      return {
        id: "google-reviews",
        meta: gr.meta,
        rating: gr.summary?.rating,
        reviewCount: gr.summary?.reviewCount,
        highlight: gr.summary?.highlight,
        cta: gr.cta,
        analytics: ctx.analytics,
      };
    }

    default:
      return undefined; // not derived
  }
}
