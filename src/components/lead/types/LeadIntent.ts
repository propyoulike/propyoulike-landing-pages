// src/components/lead/types/LeadIntent.ts

export interface LeadIntent {
  // attribution
  sourceSection?: string; // hero | summary | pricing | amenities | footer
  sourceItem?: string;   // CTA label: "Book Site Visit", "WhatsApp"

  // business identity
  builderId?: string;    // project.builder from JSON

  // optional UX context
  label?: string;
  question?: string;
}
