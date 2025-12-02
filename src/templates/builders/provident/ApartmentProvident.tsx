import React, { useState } from "react";

// Common reusable components
import Hero from "@/templates/common/Hero";
import Navbar from "@/templates/common/Navbar";
import ProjectSummary from "@/templates/common/ProjectSummary";
import FloorPlans from "@/templates/common/FloorPlans";
import HomeSizeAdvisor from "@/templates/common/HomeSizeAdvisor";
import Location from "@/templates/common/Location";
import Amenities from "@/templates/common/Amenities";
import Views from "@/templates/common/Views";
import ConstructionStatus from "@/templates/common/ConstructionStatus";
import PaymentPlans from "@/templates/common/PaymentPlans";
import LoanEligibilityWidget from "@/templates/common/LoanEligibility";
import Testimonials from "@/templates/common/Testimonials";
import Brochure from "@/templates/common/Brochure";
import ProvidentSection from "@/templates/common/AboutSection";
import FAQ from "@/templates/common/FAQ";
import LeadFormModal from "@/components/LeadFormModal";
import Footer from "@/components/Footer/Footer";

// Provident theme
import "@/themes/builders/provident.css";

interface TemplateProps {
  data: any;  // Loaded JSON from content/projects/<slug>.json
}

const ApartmentProvident: React.FC<TemplateProps> = ({ data }) => {
  const [isLeadFormOpen, setLeadFormOpen] = useState(false);

  const openForm = (src: string) => {
    console.log("Lead form opened from:", src);
    setLeadFormOpen(true);
  };

  return (
    <div className="provident-theme">

      <Hero data={data.hero} onCtaClick={() => openForm("hero")} />

      <Navbar data={data.navbar} onCtaClick={() => openForm("navbar")} />

      <ProjectSummary data={data.projectSummary} onCtaClick={() => openForm("project-summary")} />

      <FloorPlans data={data.floorPlans} onCtaClick={() => openForm("floor-plans")} />

      <HomeSizeAdvisor data={data.homeSizeAdvisor} />

      <Location data={data.location} onCtaClick={() => openForm("location")} />

      <Amenities data={data.amenities} onCtaClick={() => openForm("amenities")} />

      <Views data={data.views} onCtaClick={() => openForm("views")} />

      <ConstructionStatus data={data.constructionStatus} onCtaClick={() => openForm("construction")} />

      <PaymentPlans data={data.paymentPlans} onCtaClick={() => openForm("payment-plans")} />

      <LoanEligibilityWidget data={data.loanEligibility} onCtaClick={() => openForm("loan")} />

      <Testimonials data={data.testimonials} onCtaClick={() => openForm("testimonials")} />

      <Brochure data={data.brochure} />

      <AboutSection data={data.aboutSection} onCtaClick={() => openForm("about-provident")} />

      <FAQ data={data.faq} openLeadForm={() => openForm("faq")} />

      <LeadFormModal open={isLeadFormOpen} onOpenChange={setLeadFormOpen} />

      <Footer data={data.footer} />

    </div>
  );
};

export default ApartmentProvident;
