import Hero_component from "@/templates/common/Hero/Hero_component";
import Navbar_component from "@/templates/common/Navbar/Navbar";
import Summary_component from "@/templates/common/Summary_component/Summary_component";
import PropertyPlans_component from "@/templates/common/PropertyPlans_component/PropertyPlans_component";
import Amenities_component from "@/templates/common/Amenities_component/Amenities_component";
import Views_component from "@/templates/common/Views_component/Views_component";
import LocationUI_component from "@/templates/common/LocationUI_component/LocationUI_component";
import Construction_component from "@/templates/common/Construction_component/Construction_component";
import PaymentPlans_component from "@/templates/common/PaymentPlans_component/PaymentPlans_component";
import Testimonials_component from "@/templates/common/Testimonials_component/Testimonials_component";
import GoogleReviews_component from "@/templates/common/GoogleReviews_component/GoogleReviews_component";
import Brochure_component from "@/templates/common/Brochure_component/Brochure_component";
import AboutBuilder_component from "@/templates/common/AboutBuilder_component/AboutBuilder_component";
import Faq_component from "@/templates/common/Faq_component/Faq_component";

import LoanAssistance from "@/components/Loan/LoanAssistance/LoanAssistance";
import BuilderOtherProjects from "@/components/Widgets/BuilderOtherProjects";
import LocalityOtherProjects from "@/components/Widgets/LocalityOtherProjects";

export const COMPONENT_REGISTRY = {
  /* ===== Core Sections ===== */
  Hero_component,
  Navbar_component,
  Summary_component,
  PropertyPlans_component,
  Amenities_component,
  Views_component,
  LocationUI_component,
  Construction_component,
  PaymentPlans_component,
  Testimonials_component,
  GoogleReviews_component,
  Brochure_component,
  AboutBuilder_component,
  Faq_component,

  /* ===== Widgets (Non-section) ===== */
  LoanAssistance,
  BuilderOtherProjects,
  LocalityOtherProjects,
} as const;

export type ComponentKey = keyof typeof COMPONENT_REGISTRY;