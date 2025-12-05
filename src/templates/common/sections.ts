// -------------------------------------------------
// Section Component Imports
// -------------------------------------------------
import Hero from "@/templates/common/Hero";
import Navbar from "@/templates/common/Navbar";
import ProjectSummary from "@/templates/common/ProjectSummary";
import FloorPlans from "@/templates/common/FloorPlans";
import Amenities from "@/templates/common/Amenities";
import Views from "@/templates/common/Views";
import ConstructionStatus from "@/templates/common/ConstructionStatus";
import PaymentPlans from "@/templates/common/PaymentPlans";
import LoanEligibilityWidget from "@/components/widgets/LoanEligibilityWidget";
import CustomerSpeaks from "@/templates/common/CustomerSpeaks";
import Brochure from "@/templates/common/Brochure";
import BuilderAbout from "@/templates/common/BuilderAbout";
import FAQ from "@/templates/common/FAQ";

// -------------------------------------------------
// Section → Component Mapping (case-sensitive)
// The order here matches:
// Hero → Navbar → Summary → FloorPlans → Amenities
// Views → Construction → PaymentPlans → LoanEligibility
// CustomerSpeaks → Brochure → BuilderAbout → FAQ
// -------------------------------------------------
export const SECTION_COMPONENTS: Record<string, any> = {
  Hero,
  Navbar,
  Summary: ProjectSummary,
  FloorPlans: FloorPlans,
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

// -------------------------------------------------
// DOM IDs for in-page scrolling
// Navbar uses these IDs to scroll into sections
// Keys match section names from JSON (lowercase)
// -------------------------------------------------
export const SECTION_IDS: Record<string, string> = {
  hero: "hero",
  navbar: "navbar",
  summary: "project-summary",
  floorplans: "floor-plans",
  amenities: "amenities",
  views: "views",
  construction: "construction",
  paymentplans: "payment-plans",
  loaneligibility: "loan-eligibility",
  customerspeaks: "customer-speaks",
  brochure: "brochure",
  builderabout: "about-builder",
  faq: "faq",
};
