export const AUTHORING_RULES: Record<string, Partial<any>> = {
  testimonials: {
    note: "Each testimonial must include `name` and either `quote` or `videoId`.",
  },

  propertyPlans: {
    note:
      "Add at least one of: modelFlats, unitPlans, floorPlans, or masterPlan.image",
    requiredForAuthoring: true,
  },

  amenities: {
    note: "At least one amenity category with one item is required.",
  },

  faq: {
    note: "Each FAQ must have a question and an answer.",
  },
};
