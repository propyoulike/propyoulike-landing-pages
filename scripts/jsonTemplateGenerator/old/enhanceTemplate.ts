export function enhanceTemplate(
  section: string,
  base: any
): any {
  switch (section) {
    case "testimonials":
      return {
        title: "",
        subtitle: "",
        tagline: "",
        testimonials: [],
        _note:
          "Each testimonial must include `name` and either `quote` or `videoId`.",
      };

    case "propertyPlans":
      return {
        _note:
          "Add at least one of: modelFlats, unitPlans, floorPlans, or masterPlan.image",
      };

    case "faq":
      return {
        title: "",
        subtitle: "",
        tagline: "",
        faqs: [],
        _note:
          "Each FAQ must include question and answer. Category is optional.",
      };

    case "amenities":
      return {
        title: "",
        subtitle: "",
        tagline: "",
        amenityCategories: [],
        _note:
          "At least one amenity category with at least one item is required.",
      };

    default:
      return base;
  }
}
