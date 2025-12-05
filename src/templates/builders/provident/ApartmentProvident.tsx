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
import CustomerSpeaks from "@/templates/common/CustomerSpeaks";
import Brochure from "@/templates/common/Brochure";
import AboutSection from "@/templates/common/AboutSection";
import FAQ from "@/templates/common/FAQ";
import LeadFormModal from "@/components/LeadFormModal";
import LeadForm from "@/components/LeadForm";
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

  // Build navbar items from data or use defaults
  const navItems = data.navbar?.navItems || [
    { label: "Overview", targetId: "projectsummary" },
    { label: "Floor Plans", targetId: "floorplans" },
    { label: "Location", targetId: "location" },
    { label: "Amenities", targetId: "amenities" },
  ];

  return (
    <div className="provident-theme">

      {/* Hero Section */}
      <Hero data={data.hero || data} />

      {/* Navbar */}
      <Navbar 
        navItems={navItems}
        logoUrl={data.navbar?.logoUrl}
        ctaLabel={data.navbar?.ctaLabel}
        onCtaClick={() => openForm("navbar")} 
      />

      {/* Project Summary */}
      {data.projectSummary && (
        <ProjectSummary 
          title={data.projectSummary.title || "About"}
          highlightedName={data.projectSummary.highlightedName}
          description={data.projectSummary.description || ""}
          highlights={data.projectSummary.highlights || []}
          onCtaClick={() => openForm("project-summary")} 
        />
      )}

      {/* Floor Plans */}
      {data.floorPlans?.plans && data.floorPlans.plans.length > 0 && (
        <FloorPlans floorPlans={data.floorPlans.plans} />
      )}

      {/* Home Size Advisor */}
      {data.homeSizeAdvisor?.units && (
        <HomeSizeAdvisor 
          units={data.homeSizeAdvisor.units}
          defaultAdults={data.homeSizeAdvisor.defaultAdults}
          defaultKids={data.homeSizeAdvisor.defaultKids}
          defaultElderly={data.homeSizeAdvisor.defaultElderly}
        />
      )}

      {/* Location */}
      {data.location?.sections && (
        <Location 
          sections={data.location.sections}
          videoUrl={data.location.videoUrl}
          mapUrl={data.location.mapUrl}
          heading={data.location.heading}
          subheading={data.location.subheading}
          tagline={data.location.tagline}
          onCtaClick={() => openForm("location")} 
        />
      )}

      {/* Amenities */}
      {data.amenities && data.amenities.length > 0 && (
        <Amenities amenities={data.amenities} />
      )}

      {/* Views */}
      {data.views?.images && data.views.images.length > 0 && (
        <Views 
          images={data.views.images}
          heading={data.views.heading}
          subheading={data.views.subheading}
          onCtaClick={() => openForm("views")} 
        />
      )}

      {/* Construction Status */}
      {data.constructionStatus?.towers && data.constructionStatus.towers.length > 0 && (
        <ConstructionStatus 
          towers={data.constructionStatus.towers}
          heading={data.constructionStatus.heading}
          subheading={data.constructionStatus.subheading}
          phaseLabel={data.constructionStatus.phaseLabel}
          onCtaClick={() => openForm("construction")} 
        />
      )}

      {/* Payment Plans */}
      {data.paymentPlans && (
        <PaymentPlans 
          priceComponents={data.paymentPlans.priceComponents || []}
          paymentSchedule={data.paymentPlans.paymentSchedule || []}
          heading={data.paymentPlans.heading}
          subheading={data.paymentPlans.subheading}
          onCtaClick={() => openForm("payment-plans")} 
        />
      )}

      {/* Loan Eligibility */}
      <LoanEligibilityWidget onCtaClick={() => openForm("loan")} />

      {/* Customer Speaks / Testimonials */}
      {data.testimonials && data.testimonials.length > 0 && (
        <CustomerSpeaks 
          testimonials={data.testimonials}
          onCtaClick={() => openForm("testimonials")} 
        />
      )}

      {/* Brochure */}
      {data.brochure && (
        <Brochure 
          title={data.brochure.title || "Download Brochure"}
          subtitle={data.brochure.subtitle}
          description={data.brochure.description || ""}
          imageUrl={data.brochure.imageUrl || ""}
          documents={data.brochure.documents}
          onCtaClick={() => openForm("brochure")}
        />
      )}

      {/* About Section */}
      {data.aboutSection && (
        <AboutSection 
          title={data.aboutSection.title || "About"}
          subtitle={data.aboutSection.subtitle}
          description={data.aboutSection.description || ""}
          expandedContent={data.aboutSection.expandedContent}
          stats={data.aboutSection.stats}
          additionalInfo={data.aboutSection.additionalInfo}
          onCtaClick={() => openForm("about-provident")} 
        />
      )}

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <FAQ faqs={data.faq} />
      )}

      {/* Lead Form Modal */}
      <LeadFormModal 
        open={isLeadFormOpen} 
        onOpenChange={setLeadFormOpen}
        FormComponent={LeadForm}
      />

      {/* Footer */}
      <Footer data={data.footer} />

    </div>
  );
};

export default ApartmentProvident;
