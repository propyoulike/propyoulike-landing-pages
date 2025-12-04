import Hero from "@/templates/common/Hero";
import Navbar from "@/templates/common/Navbar";
import ProjectSummary from "@/templates/common/ProjectSummary";
import FloorPlansTabs from "@/templates/common/FloorPlansTabs";
import Location from "@/templates/common/Location";
import Amenities from "@/templates/common/Amenities";
import Views from "@/templates/common/Views";
import ConstructionStatus from "@/templates/common/ConstructionStatus";
import PaymentPlans from "@/templates/common/PaymentPlans";
import LoanEligibilityWidget from "@/components/widgets/LoanEligibilityWidget";
import CustomerSpeaks from "@/templates/common/CustomerSpeaks";
import Brochure from "@/templates/common/Brochure";
import BuilderAbout from "@/templates/common/BuilderAbout";
import FAQ from "@/templates/common/FAQ";

// ----------------------------------------------
//  SECTION COMPONENT MAPPING (case-sensitive)
// ----------------------------------------------

export const SECTION_COMPONENTS: Record<string, any> = {
  Hero,
  Navbar,
  Summary: ProjectSummary,
  FloorPlans: FloorPlansTabs,
  Location,
  Amenities,
  Views,
  Construction: ConstructionStatus,
  PaymentPlans,
  LoanEligibility: LoanEligibilityWidget,
  CustomerSpeaks,
  Brochure,
  BuilderAbout,
  FAQ,
};

// ----------------------------------------------
// DOM IDs for Navbar scrolling (normalized)
// ----------------------------------------------

export const SECTION_IDS: Record<string, string> = {
  hero: "hero",
  navbar: "navbar",
  summary: "project-summary",
  floorplans: "floorplanstabs",
  location: "location",
  amenities: "amenities",
  views: "views",
  construction: "construction",
  paymentplans: "payment-plans",
  loaneligibility: "loan-eligibility",
  customerspeaks: "customerspeaks",
  brochure: "brochure",
  builderabout: "about-builder",
  faq: "faq",
};
